// Create a new file: HighlightContext.js or HighlightContext.tsx if using TypeScript

import React, { createContext, useContext, useState } from 'react';

const HighlightContext = createContext({
  highlightedId: '',
  setHighlightedId: (id: string) => {},
});

export const useHighlight = () => useContext(HighlightContext);

export const HighlightProvider = (props: { children: any }) => {
  const [highlightedId, setHighlightedId] = useState<string>('');

  return (
    <HighlightContext.Provider value={{ highlightedId, setHighlightedId }}>
      {props.children}
    </HighlightContext.Provider>
  );
};
