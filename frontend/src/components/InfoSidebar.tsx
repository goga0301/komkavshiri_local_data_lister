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
}