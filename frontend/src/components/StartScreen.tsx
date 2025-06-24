import React from 'react';
import './ui/StartScreen.css';

type Props = { onStart: () => void };

export default function StartScreen({ onStart }: Props) {
  return (
    <div className="start-screen">
      <h1>🌍 Let's explore Qutaia</h1>
      <button onClick={onStart}>Start the Journey</button>
    </div>
  );
}