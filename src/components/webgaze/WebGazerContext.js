
import React, { createContext, useState, useEffect } from 'react';

export const WebGazeContext = createContext({ x: 0, y: 0 });

export const WebGazeProvider = ({ children }) => {
  const [gazeData, setGazeData] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScriptLoad = () => {
      window.webgazer.setGazeListener((data, elapsedTime) => {
        if (data) {
          setGazeData(window.webgazer.util.bound(data));
        }
      }).begin();
    };

    const script = document.createElement("script");
    script.src = "https://webgazer.cs.brown.edu/webgazer.js";
    script.onload = handleScriptLoad;
    script.onerror = () => console.log('Error loading WebGazer.js');
    document.head.appendChild(script);

    return () => window.webgazer && window.webgazer.end(); // Cleanup WebGazer on unmount
  }, []);

  return (
    <WebGazeContext.Provider value={gazeData}>
      {children}
    </WebGazeContext.Provider>
  );
};
