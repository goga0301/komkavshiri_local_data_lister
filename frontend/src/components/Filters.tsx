import React from "react";

/**
 * Props accepted by the Filters component.
 * These control the various filter inputs shown to the user.
 */
type FiltersProps = {
  searchQuery: string;                   // Current search input value
  onSearchChange: (query: string) => void;  // Handler to update search input
  selectedTag: string;                  // Currently selected tag
  onTagChange: (tag: string) => void;   // Handler to update tag filter
  minRating: number;                    // Minimum rating value
  onRatingChange: (rating: number) => void; // Handler to update minimum rating
  onlyTrending: boolean;                // Whether to filter only trending items
  onTrendingToggle: () => void;         // Handler to toggle trending filter
  onlyEvents: boolean;                  // Whether to filter only event items
  onEventsToggle: () => void;           // Handler to toggle events filter
  onlyBookmarks: boolean;               // Whether to show only bookmarked items
  onBookmarksToggle: () => void;        // Handler to toggle bookmarks filter
  allTags: string[];                    // List of all available tags
  onClose: () => void;                  // Callback to close the filter panel
};

/**
 * Filters component allows users to search and filter items based on:
 * - name
 * - tag
 * - rating
 * - type (event/trending/bookmarked)
 */
const Filters: React.FC<FiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  minRating,
  onRatingChange,
  onlyTrending,
  onTrendingToggle,
  onlyEvents,
  onEventsToggle,
  onlyBookmarks,        
  onBookmarksToggle,     
  allTags,
  onClose,
}) => {
  return (
    <div className="filters">
      {/*  Search input by name */}
      <input
        type="text"
        placeholder="🔍 Search by name..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {/* 🏷 Tag filter dropdown */}
      <select value={selectedTag} onChange={(e) => onTagChange(e.target.value)}>
        <option value="">All Tags</option>
        {allTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      {/*  Minimum rating filter */}
      <label>
        ⭐ Min Rating:
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={minRating}
          onChange={(e) => onRatingChange(Number(e.target.value))}
        />
        {minRating}+
      </label>

      {/*  Events only filter */}
      <label>
        <input type="checkbox" checked={onlyEvents} onChange={onEventsToggle} />
        📅 Events only
      </label>

      {/*  Trending only filter */}
      <label>
        <input
          type="checkbox"
          checked={onlyTrending}
          onChange={onTrendingToggle}
        />
        🔥 Trending only
      </label>

      {/*  Bookmarked only filter */}
      <label>
        <input
          type="checkbox"
          checked={onlyBookmarks}
          onChange={onBookmarksToggle}
        />
        📌 Bookmarked only
      </label>
    </div>
  );
};

export default Filters;
