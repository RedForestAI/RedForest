let instance = null;

export class WebGazerManager {
  constructor() {
    if (!instance) {
      instance = this;
      this.scriptId = 'webgazer-script';
      this.loadScript();
    }

    return instance;
  }

  removeExistingScript() {
    const existingScript = document.getElementById(this.scriptId);
    if (existingScript) {
      existingScript.remove();
    }
    window.webgazer = null; // Clear the existing webgazer object
  }

  loadScript() {
    this.removeExistingScript();

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = this.scriptId;
      script.src = 'https://webgazer.cs.brown.edu/webgazer.js';
      script.onload = () => resolve();
      script.onerror = () => {
        console.error('Error loading WebGazer.js');
        reject();
      };
      document.head.appendChild(script);
    });
  }

  async setupWebGazer() {
    try {
      await this.loadScript();

      window.webgazer.setGazeListener((data, elapsedTime) => {
        if (data) {
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

    if (!this.isListening) {
      this.setupWebGazer();
    } else if (!this.isActive) {
      window.webgazer && window.webgazer.resume();
      this.isActive = true;
    }
  }

  show() {
    window.webgazer && window.webgazer
      .showPredictionPoints(true)
      .showVideo(true);
  }

  hide() {
    window.webgazer && window.webgazer
      .showPredictionPoints(false)
      .showVideo(false);
  }

  stop() {
    if (this.isActive) {
      window.webgazer && window.webgazer.pause();
      this.isActive = false;
    }
  }

  end() {
    window.webgazer && window.webgazer.stopVideo();
    window.webgazer && window.webgazer.end();
    this.isActive = false;
    this.isListening = false;
    this.isLoaded = false;
  }

  getGazeData() {
    return this.gazeData;
  }
}
