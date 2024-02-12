import BaseLogger from "./base-logger"

export default class GazeLogger extends BaseLogger {
  loggedData!: [string[]]

  constructor() {
    super()
    this.init()
    this.log = this.log.bind(this);
    document.addEventListener("processedGazeUpdate", this.log)
  }

  init(){
    this.loggedData = [[
      "timestamp", 
      "x", 
      "y",
      "aoiType",
      "aoiInfo",
      "rx",
      "ry"
    ]]
  }

  clear() {
    this.init()
  }

  log(event: any) {
    this.loggedData.push([
      event.detail.t,
      event.detail.x.toFixed(3), 
      event.detail.y.toFixed(3),
      event.detail.aoiType,
      event.detail.aoiInfo,
      event.detail.rX.toFixed(3),
      event.detail.rY.toFixed(3)
    ])
  }
}