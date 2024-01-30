import React, { createContext } from 'react';
import { WebGazerManager } from './WebGazerManager';

import "./WebGazer.css"

export const webGazerContext = createContext<any>({});
export const restartWebGazerContext = createContext<any>({});

export const WebGazerProvider = (props: { children: any }) => {
  const [webGazer, setWebGazer] = React.useState<WebGazerManager>(new WebGazerManager());

  function restartWebGazer() {
    webGazer.stop();
    webGazer.end();
    setWebGazer(new WebGazerManager());
  }

  return (
    <webGazerContext.Provider value={webGazer}>
      <restartWebGazerContext.Provider value={restartWebGazer}>
        {props.children}
      </restartWebGazerContext.Provider>
    </webGazerContext.Provider>
  );
};