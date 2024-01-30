import React, { createContext, useContext, useState } from 'react';

class DataLogger {
  data: any[]
  
  constructor() {
    this.data = []
    console.log("HELLO")
  }

  log() {
    console.log("Hello World")
  }

  returnData() {
    return this.data
  }
}

const dataLogger = new DataLogger()
const DataLoggerContext = createContext<DataLogger>(dataLogger);

export default function DataLoggerProvider(props: { children: any }) {

  return (
    <DataLoggerContext.Provider value={dataLogger}>
      {props.children}
    </DataLoggerContext.Provider>
  );
};