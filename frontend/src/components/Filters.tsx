// import React from "react";

// type FiltersProps = {
//   searchQuery: string;
//   onSearchChange: (query: string) => void;
//   selectedTag: string;
//   onTagChange: (tag: string) => void;
//   minRating: number;
//   onRatingChange: (rating: number) => void;
//   onlyTrending: boolean;
//   onTrendingToggle: () => void;
//   allTags: string[];
//   onEventsToggle: () => void;
//   onlyEvents: boolean;
//   onClose: () => void;  // new prop
// };

// const Filters: React.FC<FiltersProps> = ({
//   searchQuery,
//   onSearchChange,
//   selectedTag,
//   onTagChange,
//   minRating,
//   onRatingChange,
//   onlyTrending,
//   onTrendingToggle,
//   allTags,
//   onEventsToggle,
//   onlyEvents,
//   onClose,
// }) => {
//   return (
//     <div className="filters">
//       <input
//         type="text"
//         placeholder="🔍 Search by name..."
//         value={searchQuery}
//         onChange={(e) => onSearchChange(e.target.value)}
//       />

//       <select value={selectedTag} onChange={(e) => onTagChange(e.target.value)}>
//         <option value="">All Tags</option>
//         {allTags.map((tag) => (
//           <option key={tag} value={tag}>
//             {tag}
//           </option>
//         ))}
//       </select>

//       <label>
//         ⭐ Min Rating:
//         <input
//           type="range"
//           min={0}
//           max={5}
//           step={1}
//           value={minRating}
//           onChange={(e) => onRatingChange(Number(e.target.value))}
//         />
//         {minRating}+
//       </label>

//       <label>
//         <input type="checkbox" checked={onlyEvents} onChange={onEventsToggle} />
//         📅 Events only
//       </label>

//       <label>
//         <input
//           type="checkbox"
//           checked={onlyTrending}
//           onChange={onTrendingToggle}
//         />
//         🔥 Trending only
//       </label>

//       {/* Close button at bottom */}
//       <button className="filters-close-btn" onClick={onClose}>
//         Close Filters
//       </button>
//     </div>
//   );
// };

// export default Filters;

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
  allTags: string[];
  onEventsToggle: () => void;
  onlyEvents: boolean;
  onClose: () => void;  // new prop to close filters
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
  allTags,
  onEventsToggle,
  onlyEvents,
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
    </div>
  );
};

export default Filters;

