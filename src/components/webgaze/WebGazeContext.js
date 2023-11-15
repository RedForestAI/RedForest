import React, { createContext, useState, useEffect } from 'react';
import { getWebGazerInstance } from './WebGazerManager';

export const WebGazeContext = createContext({ x: 0, y: 0 });

export const WebGazeProvider = ({ children }) => {
  const [gazeData, setGazeData] = useState({ x: 0, y: 0 });
  const webGazer = getWebGazerInstance();

  useEffect(() => {
    const interval = setInterval(() => {
      setGazeData(webGazer.getGazeData());
    }, 100); // Update gaze data every 100ms

    return () => {
      clearInterval(interval);
      webGazer.end(); // Clean up
    };
  }, [webGazer]);

  return (
    <WebGazeContext.Provider value={gazeData}>
      {children}
    </WebGazeContext.Provider>
  );
};
