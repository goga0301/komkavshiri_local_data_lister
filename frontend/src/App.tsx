import React, { useEffect, useState, useMemo } from "react";
import StartScreen from "./components/StartScreen";
import "./App.css";


function App() {

  const [started, setStarted] = useState(false);

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div className="app-container">
      {/* Toggle Filters Button */}
      <button
        className="filters-toggle-btn"
        onClick={() => setFiltersVisible((v) => !v)}
        aria-label="Toggle Filters"
      >
        {filtersVisible ? "Hide Filters ✖️" : "Show Filters 🔍"}
      </button>

      {/* Show Filters panel only if visible */}
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
          onClose={() => setFiltersVisible(false)}  // Pass close handler
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
        </div>
      </div>
      )
      }
export default App;