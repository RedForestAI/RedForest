let instance = null;

export class WebGazerManager {
  constructor() {
    if (!instance) {
      this.loadScript();
      instance = this;
    }

    return instance;
  }

  loadScript() {
    const script = document.createElement('script');
    script.src = 'https://webgazer.cs.brown.edu/webgazer.js'; // Adjust the path to your local script
    script.onload = () => {
      this.isLoaded = true;
      this.isActive = false;
      this.isListening = false;
    };
    script.onerror = () => {
      console.error('Error loading WebGazer.js');
    };
    document.head.appendChild(script);
  }

  setupWebGazer() {
    if (this.isLoaded && !this.isActive) {
      window.webgazer.setGazeListener((data, elapsedTime) => {
        if (data) {
          this.gazeData = window.webgazer.util.bound(data);
        }
      }).begin();
      this.hide();
      this.isActive = true;
      this.isListening = true;
    }
  }
  
  start() {
    if (this.isLoaded) {
      if (!this.isListening) {
        this.setupWebGazer(); 
      }
      else if (!this.isActive) {
      window.webgazer && window.webgazer.resume();
      this.isActive = true;
      }
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
      window.webgazer && window.webgazer.end();
      this.hide();
      this.isActive = false;
    }
  }

  end() {
    if (this.isActive) {
      window.webgazer && window.webgazer.end();
      this.isActive = false;
    }
  }

  getGazeData() {
    return this.gazeData;
  }
}

export const getWebGazerInstance = () => {
  if (!instance) {
    instance = new WebGazerManager();
  }
  return instance;
};
