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
      );
      }