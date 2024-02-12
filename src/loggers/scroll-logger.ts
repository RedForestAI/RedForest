import BaseLogger from "./base-logger"

// Function to debounce a given function
function debounce(func: any, delay: number) {
  let timer: any;
  return function () {
    // @ts-ignore
    const context: any = this;
    const args = arguments;

    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export default class ScrollLogger extends BaseLogger {
  loggedData!: [string[]]

  constructor() {
    super()
    this.init()
    this.log = this.log.bind(this)
    let debounced_log = debounce(this.log, 10)
    document.addEventListener("scroll", debounced_log)
  }

  init() {
    this.loggedData = [["timestamp", "scrollYAbsolute", "scrollYPercentage"]]
  }

  clear() {
    this.init()
  }

  log(event: any) {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  
    const percentageScrolled = (scrollY / (documentHeight - windowHeight)) * 100;
  
    // console.log("Raw Y Value:", scrollY);
    // console.log("Percentage Scrolled:", percentageScrolled.toFixed(2) + "%");
  
    this.loggedData.push([new Date().toISOString(), scrollY.toFixed(3), percentageScrolled.toFixed(3)]);
  }
  
}