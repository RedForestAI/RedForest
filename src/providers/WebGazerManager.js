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
  }

  async start() {
    await window.webgazer.setRegression('ridge') /* currently must set regression and tracker */
      //.setTracker('clmtrackr')
      .setGazeListener(function(data, clock) {
        //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
        //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
      })
      .saveDataAcrossSessions(true)
      .begin();
    window.webgazer.showVideoPreview(true) /* shows all video previews */
        .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
        .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */
  }

}