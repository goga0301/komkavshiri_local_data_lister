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
      </div>
      )
      }
export default App;