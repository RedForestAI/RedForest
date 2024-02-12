import { arrayToCsv } from "./log_utils"

export default class BaseLogger {
  loggedData: [string[]]

  constructor() {
    this.loggedData = [[]]
  }

  init() {
  }

  log(event: any) {
  }

  clear() {
    this.init()
  }

  getBlob() {
    let content = arrayToCsv(this.loggedData)
    let blob = new Blob([content], { type: "text/csv;charset=utf-8"})
    this.init()
    return blob
  }

}