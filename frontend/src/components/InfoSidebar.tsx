import React, { useState, useEffect } from 'react';
import { ILocalItem } from '../types/ILocalItem';
import './ui/InfoSidebar.css';

// Props expected by the InfoSidebar component
type Props = {
  selectedItem: ILocalItem | null;        // The currently selected item on the map
  onDelete: (itemId: string) => void;     // Callback when user wants to delete an item
  onEdit: (item: ILocalItem) => void;     // Callback when user wants to edit an item
  sessionItemIds: Set<string>;            // Items created during the current session (editable/deletable)
};

export default function InfoSidebar({ selectedItem, onDelete, onEdit, sessionItemIds }: Props) {
  const [imgError, setImgError] = useState(false); // Tracks if the image fails to load

  // Local state to manage bookmarked item IDs (stored in localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  /**
   * Load bookmarked IDs from localStorage on component mount
   */
  useEffect(() => {
    const stored = localStorage.getItem("bookmarks");
    if (stored) {
      setBookmarkedIds(JSON.parse(stored));
    }
  }, []);

  /**
   * Helper function to update both state and localStorage
   */
  const updateBookmarks = (newBookmarks: string[]) => {
    setBookmarkedIds(newBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  /**
   * Check if the currently selected item is already bookmarked
   */
  const isBookmarked = selectedItem ? bookmarkedIds.includes(selectedItem.id) : false;

  /**
   * Toggle the bookmark state of the selected item
   */
  const handleBookmarkToggle = () => {
    if (!selectedItem) return;
    const id = selectedItem.id;
    if (isBookmarked) {
      updateBookmarks(bookmarkedIds.filter((bid) => bid !== id));
    } else {
      updateBookmarks([...bookmarkedIds, id]);
    }
  };

  /**
   * Preload and validate image whenever selectedItem changes
   */
  useEffect(() => {
    if (!selectedItem?.imageUrl) {
      setImgError(true);
      return;
    }

    const img = new Image();
    img.src = selectedItem.imageUrl;

    img.onload = () => setImgError(false);
    img.onerror = () => setImgError(true);
  }, [selectedItem]);

  /**
   * If no item is selected, show instructional prompt
   */
  if (!selectedItem) {
    return (
      <div className="info-sidebar empty">
        <p>🧭 Click on a marker to learn more about it! <br /><br />🧭 Click on empty space to mark place and click on marker to add item!</p>
      </div>
    );
  }

  /**
   * Only allow editing/deleting if the item was created in this session
   */
  const isEditable = sessionItemIds.has(selectedItem.id);

  return (
    <div className="info-sidebar">
      {/* Display image if loaded successfully */}
      {!imgError && selectedItem.imageUrl && (
        <img
          src={selectedItem.imageUrl}
          alt={selectedItem.name}
          onError={() => setImgError(true)}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}

      {/* Main info block */}
      <h2>{selectedItem.name}</h2>
      <p>{selectedItem.description}</p>
      <p><strong>Location:</strong> {selectedItem.location}</p>
      <p><strong>Rating:</strong> {selectedItem.rating} ⭐</p>
      <p><strong>Tags:</strong> {selectedItem.tags.join(', ')}</p>
      <p><strong>Open:</strong> {selectedItem.openingHours.open} - {selectedItem.openingHours.close}</p>
      <p><strong>Mystery Score:</strong> {selectedItem.mysteryScore} 🕵️</p>
      <blockquote>
        “{selectedItem.featuredReview.comment}” — <i>{selectedItem.featuredReview.author}</i>
      </blockquote>

      {/* Edit/Delete actions (if allowed) */}
      <div className="action-buttons">
        <button
          className="edit-btn"
          onClick={() => {
            if (isEditable) onEdit(selectedItem);
            else alert("You do not have permission to edit this item.");
          }}
        >
          Edit
        </button>
        <button
          className="delete-btn"
          onClick={() => {
            if (isEditable) onDelete(selectedItem.id);
            else alert("You do not have permission to delete this item.");
          }}
        >
          Delete
        </button>
      </div>

      {/* Bookmark toggle button */}
      <div className="bookmark-button-container">
        <button className="bookmark-btn" onClick={handleBookmarkToggle}>
          {isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}
        </button>
      </div>
    </div>
  );
}
