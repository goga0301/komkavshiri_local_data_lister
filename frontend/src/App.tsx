import React, { useEffect, useState, useMemo } from "react";
import StartScreen from "./components/StartScreen";
import "./App.css";


function App() {

  const [started, setStarted] = useState(false);

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  return (
  <div className="app-container">
      <div className="map-wrapper">
        <MapView
          items={filteredItems}
          onSelectItem={setSelectedItem}
          onRequestAddItem={(coords) => {
            setPendingCoords(coords);
            setAddingItem(true);
          }}
        />
      </div>
  </div>
  );
}
export default App;