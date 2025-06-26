import React from 'react';
import './ui/StartScreen.css';

//  Props type definition for StartScreen
// This component expects a single function prop `onStart` that gets called when the user clicks "Start"
type Props = {
  onStart: () => void;
};

/**
 * StartScreen Component
 * ---------------------
 * A simple welcome screen that introduces the app and triggers the main app view when "Start" is clicked.
 */
export default function StartScreen({ onStart }: Props) {
  return (
    <div className="start-screen">
      {/* Main welcome heading */}
      <h1>🌍 Let's explore Qutaia</h1>

      {/* Start button that triggers the `onStart` callback passed from parent */}
      <button onClick={onStart}>Start the Journey</button>
    </div>
  );
}
