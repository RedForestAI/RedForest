import { useEffect } from "react";

/** Convert a 2D array into a CSV string
 */
function arrayToCsv(data: any[]){
  return data.map(row =>
    row
    .map(String)  // convert every value to String
    .map((v: any) => v.replaceAll('"', '""'))  // escape double quotes
    .map((v: any) => `"${v}"`)  // quote it
    .join(',')  // comma-separated
  ).join('\r\n');  // rows starting on new lines
}

type GazeData = {
  x: number
  y: number
  timestamp: string
}

export default class GazeLogger {
  loggedData: GazeData[]

  constructor() {
    this.loggedData = []
    document.addEventListener("gazeUpdate", (e) => {this.log(e)})
  }

  log(event: any) {
    this.loggedData.push({x: event.detail.x, y: event.detail.y, timestamp: new Date().toISOString()})
  }

  getBlob() {
  }
}