import BaseLogger from "./base-logger"

export default class ActionsLogger extends BaseLogger {
  loggedData!: [string[]]

  constructor() {
    super()
    this.init()
    this.log = this.log.bind(this);
    document.addEventListener("questionSubmit", this.log)
    document.addEventListener("pdfChange", this.log)
    document.addEventListener("eyeTracker", this.log)
    document.addEventListener("activityComplete", this.log)
  }

  init(){
    this.loggedData = [["timestamp", "type", "value"]]
  }

  log(event: any) {
    this.loggedData.push([new Date().toISOString(), event.detail.type.toString(), JSON.stringify(event.detail.value)])
  }
}