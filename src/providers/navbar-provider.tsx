import React, { useState, createContext } from 'react';

export const middleNavBarContext = createContext<React.ReactNode>(<></>);
export const useMiddleNavBarContext = createContext<any>(undefined);

export const MiddleNavBarProvider = (props: { children: any }) => {
  const [middleNavBarContent, setMiddleNavBarContent] = useState<React.ReactNode>(<></>);

  return (
    <middleNavBarContext.Provider value={middleNavBarContent}>
      {/* @ts-ignore */}
      <useMiddleNavBarContext.Provider value={{ setMiddleNavBarContent }}>
        {props.children}
      </useMiddleNavBarContext.Provider>
    </middleNavBarContext.Provider>
  );
};
