import React, { createContext, useContext, useState } from 'react';

const DataLogger = () => {
  const data: any[] = []

  function log() {
    console.log("Hello World")
  }

  function returnData() {
    return data
  }
}

const DataLoggerContext = createContext<any>(undefined);

export default function DataLoggerProvider(props: { children: any }) {
  const dataLogger = DataLogger();

  return (
    <DataLoggerContext.Provider value={ dataLogger }>
      {props.children}
    </DataLoggerContext.Provider>
  );
};