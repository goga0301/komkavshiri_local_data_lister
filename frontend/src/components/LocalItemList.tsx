
import React, { useEffect, useState } from 'react';
import { fetchLocalItems } from '../services/api';
import { ILocalItem } from '../types/ILocalItem';
import LocalItemCard from './LocalItemCard';
import './LocalItemList.css';

interface Props {
  onSelect: (item: ILocalItem) => void;
}

const LocalItemList: React.FC<Props> = ({ onSelect }) => {
  const [items, setItems] = useState<ILocalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchLocalItems()
      .then((data) => setItems(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status-msg">Loading items...</p>;
  if (error) return <p className="status-msg error">Error loading items.</p>;

  return (
    <div className="localitem-list">
      {items.map((item) => (
        <LocalItemCard key={item.id} item={item} onClick={() => onSelect(item)} />
      ))}
    </div>
  );
};

export default LocalItemList;
