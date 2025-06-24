import React, { useState, useEffect } from 'react';
import { ILocalItem } from '../types/ILocalItem';
import './ui/InfoSidebar.css';

type Props = {
  selectedItem: ILocalItem | null;
  onDelete: (itemId: string) => void;
  onEdit: (item: ILocalItem) => void;
  sessionItemIds: Set<string>;
};

export default function InfoSidebar({ selectedItem, onDelete, onEdit, sessionItemIds }: Props) {
  const [imgError, setImgError] = useState(false);

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

      if (!selectedItem) {
    return (
      <div className="info-sidebar empty">
        <p>🧭 Click on a marker to learn more about it! <br /><br />🧭 Click on empty space to mark place and click on marker to add item!</p>
      </div>
    );
  }

    const isEditable = sessionItemIds.has(selectedItem.id);

      return (
    <div className="info-sidebar">
      {!imgError && selectedItem.imageUrl && (
        <img 
          src={selectedItem.imageUrl} 
          alt={selectedItem.name} 
          onError={() => setImgError(true)} 
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
      <h2>{selectedItem.name}</h2>
      <p>{selectedItem.description}</p>
      <p><strong>Location:</strong> {selectedItem.location}</p>
      <p><strong>Rating:</strong> {selectedItem.rating} ⭐</p>
      <p><strong>Tags:</strong> {selectedItem.tags.join(', ')}</p>
      <p><strong>Open:</strong> {selectedItem.openingHours.open} - {selectedItem.openingHours.close}</p>
      <p><strong>Mystery Score:</strong> {selectedItem.mysteryScore} 🕵️</p>
      </div>
      );
}