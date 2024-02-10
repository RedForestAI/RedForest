const triggerGazeUpdate = (eventName, detail) => {
  // Create a custom event with a given name and detail object
  const event = new CustomEvent(eventName, { detail });
  // Dispatch the event on the document
  document.dispatchEvent(event);
};

export class WebGazerManager {
  constructor() {
    this.webgazerVideoContainer = null
  }

  async start() {

    // Clear the data
    window.webgazer.clearData();

    await window.webgazer.setRegression('ridge') /* currently must set regression and tracker */
      window.webgazer.setGazeListener((data, elapsedTime) => {
        if (data) {
          // @ts-ignore
          let gazeData = window.webgazer.util.bound(data);
          const gazeUpdate = {
            x: gazeData.x,
            y: gazeData.y,
            t: new Date().toISOString()
          }
          triggerGazeUpdate("gazeUpdate", gazeUpdate);
        }
      })
      .saveDataAcrossSessions(false)
      .begin();
    window.webgazer
      .showVideoPreview(true) /* shows all video previews */
      .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
      .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */
  }

  show() {
    window.webgazer
      .showVideoPreview(true)
      .showPredictionPoints(true)
  }

  hide() {
    window.webgazer
      .showVideoPreview(false)
      .showPredictionPoints(false)
  }

  restart() {
    // Clear the data
    window.webgazer.clearData();
    window.webgazer.end()
  }

}