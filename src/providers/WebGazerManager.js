import "./WebGazer.css"

// @ts-ignore
let instance = null;

export class WebGazerManager {
  constructor() {
    // @ts-ignore
    if (!instance) {
      instance = this;
      this.scriptId = 'webgazer-script';
      this.scriptLoaded = false;
      this.isActive = false;
      // Only load script if in the browser environment
      if (typeof window !== "undefined") {
        this.loadScript();
      }
    }
    return instance;
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
          this.gazeData = window.webgazer.util.bound(data);
        }
      }).begin();
      this.hide();
      this.isActive = true;
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
      // @ts-ignore
      window.webgazer
        .showPredictionPoints(true)
        .showVideo(true);
    }
    const array = ["webgazerFaceFeedbackBox", "webgazerFaceOverlay", "webgazerVideoFeed"]
    array.forEach((e) => {
      var element = document.getElementById(e);
      if (element) {
        // element.style.display = "visible";
        element.style.display = "inline";

      }
    })
  }

  hide() {
    // @ts-ignore
    if (this.isActive && window.webgazer) {
      // @ts-ignore
      window.webgazer
        .showPredictionPoints(false)
        .showVideo(false);
    }
    const array = ["webgazerFaceFeedbackBox", "webgazerFaceOverlay", "webgazerVideoFeed"]
    array.forEach((e) => {
      var element = document.getElementById(e);
      if (element) {
        element.style.display = "none";
      }
    })
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
}