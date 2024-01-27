import React, { useState, createContext } from 'react';

export const NavBarContext = createContext<React.ReactNode>(<></>);
export const useNavBarContext = createContext<any>(undefined);

export const NavBarProvider = (props: { children: any }) => {
  const [navBarContent, setNavBarContent] = useState<React.ReactNode>(<></>);

  return (
    <NavBarContext.Provider value={navBarContent}>
      {/* @ts-ignore */}
      <useNavBarContext.Provider value={{ setNavBarContent }}>
        {props.children}
      </useNavBarContext.Provider>
    </NavBarContext.Provider>
  );
};
