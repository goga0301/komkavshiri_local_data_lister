import React, { useEffect, useState, useMemo } from "react";
import MapView from "./components/MapView";
import InfoSidebar from "./components/InfoSidebar";
import StartScreen from "./components/StartScreen";
import Filters from "./components/Filters";
import { ILocalItem } from "./types/ILocalItem";
import { fetchLocalItems } from "./services/api";
import "./App.css";
import axios from "axios";
import AddItemModal from "./components/AddItemModel";
import { v4 as uuidv4 } from "uuid";
import AuthPanel from "./components/AuthPanel";

function App() {
  const [user, setUser] = useState<{ username: string; token: string } | null>(null);
  const [items, setItems] = useState<ILocalItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ILocalItem | null>(null);
  const [started, setStarted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [onlyTrending, setOnlyTrending] = useState(false);
  const [onlyEvents, setOnlyEvents] = useState(false);
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<ILocalItem | null>(null);
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [sessionItemIds, setSessionItemIds] = useState<Set<string>>(new Set());
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLocalItems().then(setItems);
    }
  }, [user]);

  const filteredItems = useMemo(() => {
    const bookmarkedIds = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === "" || item.tags.includes(selectedTag);
      const matchesRating = item.rating >= minRating;
      const matchesTrending = !onlyTrending || item.isTrending;
      const matchesEvent = !onlyEvents || item.type === "event";
      const matchesBookmarks = !onlyBookmarks || bookmarkedIds.includes(item.id);
      return matchesSearch && matchesTag && matchesRating && matchesTrending && matchesEvent && matchesBookmarks;
    });
  }, [items, searchQuery, selectedTag, minRating, onlyTrending, onlyEvents, onlyBookmarks]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((item) => item.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [items]);

  const handleDelete = (itemId: string) => {
    axios.delete(`http://localhost:3001/api/local-items/${itemId}`)
      .then(() => {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
        setSessionItemIds((prev) => {
          const copy = new Set(prev);
          copy.delete(itemId);
          return copy;
        });
        setSelectedItem(null);
      })
      .catch((err) => {
        alert("Failed to delete item.");
        console.error(err);
      });
  };

  const handleEditSubmit = (updatedData: Partial<ILocalItem>) => {
    if (!editingItem) return;
    const updatedItem = { ...editingItem, ...updatedData };
    axios.put(`http://localhost:3001/api/local-items/${editingItem.id}`, updatedItem)
      .then((res) => {
        setItems((prev) => prev.map((i) => i.id === editingItem.id ? res.data : i));
        setEditingItem(null);
        setSelectedItem(res.data);
      })
      .catch((err) => {
        alert("Failed to update item.");
        console.error(err);
      });
  };

  if (!user) {
    return <AuthPanel onLoginSuccess={setUser} />;
  }

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div className="app-container">
      <button
        className="filters-toggle-btn"
        onClick={() => setFiltersVisible((v) => !v)}
        aria-label="Toggle Filters"
      >
        {filtersVisible ? "Hide Filters ✖️" : "Show Filters 🔍"}
      </button>

      {filtersVisible && (
        <Filters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          minRating={minRating}
          onRatingChange={setMinRating}
          onlyTrending={onlyTrending}
          onTrendingToggle={() => setOnlyTrending((prev) => !prev)}
          allTags={allTags}
          onlyEvents={onlyEvents}
          onEventsToggle={() => setOnlyEvents((prev) => !prev)}
          onlyBookmarks={onlyBookmarks}
          onBookmarksToggle={() => setOnlyBookmarks((prev) => !prev)}
          onClose={() => setFiltersVisible(false)}
        />
      )}

      <InfoSidebar
        selectedItem={selectedItem}
        onDelete={handleDelete}
        onEdit={setEditingItem}
        sessionItemIds={sessionItemIds}
      />

      <div className="map-wrapper">
        <MapView
          items={filteredItems}
          onSelectItem={setSelectedItem}
          onRequestAddItem={(coords) => {
            setPendingCoords(coords);
            setAddingItem(true);
          }}
        />
      </div>

      {addingItem && (
        <AddItemModal
          onClose={() => {
            setAddingItem(false);
            setPendingCoords(null);
          }}
          onSubmit={(data) => {
            if (!pendingCoords) return;
            const fullItem: ILocalItem = {
              id: uuidv4(),
              name: data.name || "",
              type: data.type || "secret_spot",
              description: data.description || "",
              location: data.location || "",
              rating: data.rating || 0,
              tags: data.tags || [],
              imageUrl: data.imageUrl || "",
              isTrending: data.isTrending || false,
              openingHours: data.openingHours || { open: "", close: "" },
              featuredReview: data.featuredReview || { author: "", comment: "", stars: 0 },
              accessibility: data.accessibility || [],
              mysteryScore: data.mysteryScore || 0,
              coordinates: pendingCoords,
            };
            axios.post("http://localhost:3001/api/local-items", fullItem)
              .then((res) => {
                setItems((prev) => [...prev, res.data]);
                setSessionItemIds((prev) => new Set(prev).add(res.data.id));
                setAddingItem(false);
                setPendingCoords(null);
              })
              .catch((error) => {
                if (error.response) {
                  console.error("Backend responded with error:", error.response.status, error.response.data);
                } else {
                  console.error("Request failed:", error.message);
                }
              });
          }}
        />
      )}

      {editingItem && (
        <AddItemModal
          onClose={() => setEditingItem(null)}
          onSubmit={handleEditSubmit}
          initialData={editingItem}
          submitLabel="Edit"
        />
      )}
    </div>
  );
}

export default App;