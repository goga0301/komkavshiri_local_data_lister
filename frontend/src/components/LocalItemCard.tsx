import React from 'react';
import { ILocalItem } from '../types/ILocalItem';
import './LocalItemCard.css';

interface Props {
  item: ILocalItem;
  onClick: () => void;
}

const LocalItemCard: React.FC<Props> = ({ item, onClick }) => {
  return (
    <div className="localitem-card" onClick={onClick}>
      <h3>{item.name}</h3>
      <p>{item.description?.slice(0, 80)}...</p>
      <small>{item.location}</small>
    </div>
  );
};

export default LocalItemCard;
