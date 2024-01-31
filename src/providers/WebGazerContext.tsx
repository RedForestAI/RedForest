import React, { createContext, useRef } from 'react';
import { WebGazerManager } from './WebGazerManager';

import "./WebGazer.css"

export const webGazerContext = createContext<any>({});

export const WebGazerProvider = (props: { children: any }) => {
  const webGazerRef = useRef<WebGazerManager | null>(null)

  if (!webGazerRef.current) {
    webGazerRef.current = new WebGazerManager();
  }

  return (
    <webGazerContext.Provider value={webGazerRef.current}>
        {props.children}
    </webGazerContext.Provider>
  );
};