import { useEffect } from "react";

/** Convert a 2D array into a CSV string
 * https://stackoverflow.com/a/68146412/13231446
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


export default class GazeLogger {
  loggedData: [string[]]

  constructor() {
    this.loggedData = [["x", "y", "timestamp"]]
    // document.addEventListener("gazeUpdate", (e) => {this.log(e)})
    this.log = this.log.bind(this);
    document.addEventListener("gazeUpdate", this.log)
  }

  log(event: any) {
    this.loggedData.push([event.detail.x.toFixed(3), event.detail.y.toFixed(3), new Date().toISOString()])
    console.log(this.loggedData)
  }

  getBlob(): Blob {
    console.log(this.loggedData)
    let content = arrayToCsv(this.loggedData)
    console.log(content)
    let blob = new Blob([content], { type: "text/csv;charset=utf-8"})
    console.log(blob)
    this.loggedData = [["x", "y", "timestamp"]]
    console.log(blob)
    return blob
  }
}