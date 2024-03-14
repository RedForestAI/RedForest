import BaseLogger from "./BaseLogger"

export type ActionLog = {
  type: string,
  value: any
}

export const triggerActionLog = (detail: ActionLog) => {
  // Create a custom event with a given name and detail object
  const event = new CustomEvent("actionLog", { detail });
  // Dispatch the event on the document
  document.dispatchEvent(event);
};

export default class ActionsLogger extends BaseLogger {
  loggedData!: [string[]]

  constructor() {
    super()
    this.init()
    this.log = this.log.bind(this);
    document.addEventListener("actionLog", this.log)
  }

  name() {
    return "actions"
  }

  init(){
    this.loggedData = [["timestamp", "type", "value"]]
  }
  
  clear() {
    this.init()
  }

  log(event: any) {
    this.loggedData.push([new Date().toISOString(), event.detail.type.toString(), JSON.stringify(event.detail.value)])
  }
}