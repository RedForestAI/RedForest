import BaseLogger from "./base-logger"

export default class GazeLogger extends BaseLogger {
  loggedData!: [string[]]

  constructor() {
    super()
    this.init()
    this.log = this.log.bind(this);
    document.addEventListener("gazeUpdate", this.log)
  }

  init(){
    this.loggedData = [["timestamp", "x", "y"]]
  }

  log(event: any) {
    this.loggedData.push([new Date().toISOString(), event.detail.x.toFixed(3), event.detail.y.toFixed(3)])
  }
}