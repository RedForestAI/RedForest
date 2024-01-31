// @ts-ignore
let instance = null;

const tiggerGazeUpdate = (eventName, detail) => {
  // Create a custom event with a given name and detail object
  const event = new CustomEvent(eventName, { detail });
  // Dispatch the event on the document
  document.dispatchEvent(event);
};

export class WebGazerManager {
  constructor() {

    this.webgazerVideoContainer = null

    // @ts-ignore
    if (!instance) {
      instance = this;
      this.init()
    }
    return instance;
  }

  init() {
    this.scriptId = 'webgazer-script';
    this.scriptLoaded = false;
    this.isActive = false;
    // Only load script if in the browser environment
    if (typeof window !== "undefined") {
      this.loadScript();
    }
  }

  removeExistingScript() {
    // Ensure this runs only in the browser
    if (typeof document !== "undefined") {
      // @ts-ignore
      const existingScript = document.getElementById(this.scriptId);
      if (existingScript) {
        existingScript.remove();
      }
      if (typeof window !== "undefined") {
        // @ts-ignore
        window.webgazer = null; // Clear the existing webgazer object
      }
    }
  }

  loadScript() {
    this.removeExistingScript();

    if (typeof document !== "undefined") {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        // @ts-ignore
        script.id = this.scriptId;
        script.src = 'https://webgazer.cs.brown.edu/webgazer.js';
        script.onload = () => {
          this.scriptLoaded = true;
          // @ts-ignore
          resolve();
        };
        script.onerror = () => {
          console.error('Error loading WebGazer.js');
          reject();
        };
        document.head.appendChild(script);
      });
    }
  }

  async setupWebGazer() {
    try {
      await this.loadScript();
      // @ts-ignore
      window.webgazer.setGazeListener((data, elapsedTime) => {
        if (data) {
          // @ts-ignore
          let gazeData = window.webgazer.util.bound(data);
          tiggerGazeUpdate("gazeUpdate", gazeData);
        }
      }).begin();
      this.hide();
      this.isActive = true;
      window.webgazer.params.showGazeDot = false;
    } catch (error) {
      console.error('Error setting up WebGazer:', error);
    }
  }

  start() {
    if (!this.scriptLoaded) {
      this.loadScript();
    }
    // @ts-ignore
    if (!this.isListening) {
      this.setupWebGazer();
    } else if (!this.isActive) {
      // @ts-ignore
      window.webgazer && window.webgazer.resume();
      this.isActive = true;
    }
  }

  show() {
    // @ts-ignore
    if (this.isActive && window.webgazer) {
      if (this.webgazerVideoContainer) {
        document.body.appendChild(this.webgazerVideoContainer)
        this.webgazerVideoContainer = null
      }
    }
  }

  hide() {
    // @ts-ignore
    if (this.isActive && window.webgazer) {
      this.webgazerVideoContainer = document.getElementById("webgazerVideoContainer")
      document.body.removeChild(this.webgazerVideoContainer)
    }
  }

  stop() {
    // @ts-ignore
    if (this.isActive && window.webgazer) {
      // @ts-ignore
      window.webgazer.pause();
      this.isActive = false;
    }
  }

  end() {
    try {
      // @ts-ignore
      if (window.webgazer) {
        // @ts-ignore
        window.webgazer.stopVideo();
        // @ts-ignore
        window.webgazer.end();
        this.isActive = false;
        this.scriptLoaded = false;
      }
    } catch (error) {
      console.error('Error in ending WebGazer:', error);
    }
  }

  restart() {
    this.stop()
    this.end()
    this.init()
  }
}