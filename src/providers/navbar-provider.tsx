import React, { useState, createContext } from 'react';

export const NavBarContext = createContext<React.PureComponent | null>(null);
export const useNavBarContext = createContext<any>(null);

export const NavBarProvider = (props: { children: any }) => {
  const [navBarContent, setNavBarContent] = useState<React.PureComponent | null>(null);

  return (
    <NavBarContext.Provider value={navBarContent}>
      <useNavBarContext.Provider value={{ setNavBarContent }}>
        {props.children}
      </useNavBarContext.Provider>
    </NavBarContext.Provider>
  );
};
