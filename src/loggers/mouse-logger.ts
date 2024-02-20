import BaseLogger from "./base-logger"
import { debounce } from "~/utils/functional"
import { AOIEncoding } from "~/eyetracking/aoi-encoding"

export default class MouseLogger extends BaseLogger {
  loggedData!: [string[]]

  constructor() {
    super()
    this.init()
    this.log = this.log.bind(this)
    let debounced_log = debounce(this.log, 100)
    document.addEventListener("mousemove", debounced_log)
    document.addEventListener("click", debounce(this.log, 10))
  }

  init() {
    this.loggedData = [["timestamp", "type", "x", "y", "aoiType", "aoiInfo", "rx", "ry"]]
  }

  clear() {
    this.init()
  }

  log(event: MouseEvent | PointerEvent) {

    let aoi = AOIEncoding(event.clientX, event.clientY)
    if (aoi) {
      this.loggedData.push([
        new Date().toISOString(), 
        event.type, 
        event.clientX.toFixed(3), 
        event.clientY.toFixed(3), 
        aoi.aoiType, 
        aoi.aoiInfo, 
        aoi.rX.toFixed(3),
        aoi.rY.toFixed(3)
      ])
    }
    else {
      this.loggedData.push([
        new Date().toISOString(), 
        event.type, 
        event.clientX.toFixed(3), 
        event.clientY.toFixed(3), 
        "", 
        "", 
        "",
        ""
      ])
    }
  }
}
