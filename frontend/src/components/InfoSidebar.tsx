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
}