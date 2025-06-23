import React, { useEffect, useState, useMemo } from "react";
import StartScreen from "./components/StartScreen";
import "./App.css";


function App() {

  const [started, setStarted] = useState(false);

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }
}