import React, { useEffect, useState } from 'react';
import { fetchLocalItems } from '../services/api';       // API function to fetch all local items
import { ILocalItem } from '../types/ILocalItem';         // Type definition for a local item
import LocalItemCard from './LocalItemCard';              // Reusable component to render each item
import './LocalItemList.css';                             // CSS styles for the list

// Props expected by LocalItemList
interface Props {
  onSelect: (item: ILocalItem) => void; // Callback triggered when an item is clicked
}

/**
 * LocalItemList Component
 * -----------------------
 * Displays a list of local items (e.g., places or events) by fetching them from the backend.
 * Each item is shown using the <LocalItemCard /> component.
 * Handles loading and error states gracefully.
 */
const LocalItemList: React.FC<Props> = ({ onSelect }) => {
  const [items, setItems] = useState<ILocalItem[]>([]);   // Fetched items
  const [loading, setLoading] = useState(true);           // Loading state
  const [error, setError] = useState(false);              // Error state

  // Fetch data when the component mounts
  useEffect(() => {
    fetchLocalItems()
      .then((data) => setItems(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Show loading state
  if (loading) return <p className="status-msg">Loading items...</p>;

  // Show error message
  if (error) return <p className="status-msg error">Error loading items.</p>;

  return (
    <div className="localitem-list">
      {/* Render each item as a clickable card */}
      {items.map((item) => (
        <LocalItemCard key={item.id} item={item} onClick={() => onSelect(item)} />
      ))}
    </div>
  );
};

export default LocalItemList;
