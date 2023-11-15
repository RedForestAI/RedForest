let instance = null;

export class WebGazerManager {
  constructor() {
    if (!instance) {
      this.init();
      instance = this;
    }

    return instance;
  }

  init() {
    // Load the webgazer.js script
    const script = document.createElement('script');
    script.src = 'https://webgazer.cs.brown.edu/webgazer.js'; // Adjust the path to your local script
    script.onload = () => {
      this.setupWebGazer();
    };
    script.onerror = () => {
      console.error('Error loading WebGazer.js');
    };
    document.head.appendChild(script);
  }

  setupWebGazer() {
    // Initialize WebGazer after the script is loaded
    window.webgazer.setGazeListener((data, elapsedTime) => {
      if (data) {
        this.gazeData = window.webgazer.util.bound(data);
      }
    }).begin();
  }

  end() {
    window.webgazer && window.webgazer.end();
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
