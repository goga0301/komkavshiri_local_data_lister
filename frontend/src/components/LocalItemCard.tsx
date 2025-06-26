import React from 'react';
import { ILocalItem } from '../types/ILocalItem'; // Type definition for local item structure
import './LocalItemCard.css'; // CSS module for styling the card component

// Define props expected by LocalItemCard
interface Props {
  item: ILocalItem;   // The local item to display (name, description, location, etc.)
  onClick: () => void; // Callback for when the card is clicked
}

/**
 * A small clickable card component used to display a summary of a local item.
 * Useful for listing items in a scrollable list or grid.
 */
const LocalItemCard: React.FC<Props> = ({ item, onClick }) => {
  return (
    <div className="localitem-card" onClick={onClick}>
      {/* Display item name */}
      <h3>{item.name}</h3>

      {/* Show a shortened version of the description */}
      <p>{item.description?.slice(0, 80)}...</p>

      {/* Display location in smaller text */}
      <small>{item.location}</small>
    </div>
  );
};

export default LocalItemCard;
