import React from "react";

type FiltersProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  onlyTrending: boolean;
  onTrendingToggle: () => void;
  onlyEvents: boolean;
  onEventsToggle: () => void;
  onlyBookmarks: boolean; 
  onBookmarksToggle: () => void; 
  allTags: string[];
  onClose: () => void;
};

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
      <input
        type="text"
        placeholder="🔍 Search by name..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select value={selectedTag} onChange={(e) => onTagChange(e.target.value)}>
        <option value="">All Tags</option>
        {allTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

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

      <label>
        <input type="checkbox" checked={onlyEvents} onChange={onEventsToggle} />
        📅 Events only
      </label>

      <label>
        <input
          type="checkbox"
          checked={onlyTrending}
          onChange={onTrendingToggle}
        />
        🔥 Trending only
      </label>

      {/* ✅ Bookmarks filter */}
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
