"use client";

import { useEffect } from "react"
// import webgazer from "~/utils/webgazer/webgazer"
// import { WebGazerManager } from '../contexts/webgaze/WebGazerManager'
// import useScript from "./useScript"

// https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx

export default function WebGazer() {
//   useScript("/webgazer.js")
//   useScript("https://webgazer.cs.brown.edu/webgazer.js")

  const handleStart = async () => {
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
  };
  
  const handleHide = () => {
    // webGazer.hide();
  };
  
  const handleShow = () => {
    // webGazer.show();
  };

  const handleStop = () => {
    // webgazer.stop();
  };
  
  const handleEnd = () => {
    window.webgazer.end();
    // webGazer = new WebGazerManager();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <button className="btn btn-primary text-white font-bold py-2 px-4 rounded hover:bg-blue-700 m-2" onClick={handleStart}>Start WebGazer</button>
      <button className="btn text-white font-bold py-2 px-4 rounded hover:bg-green-700 m-2" onClick={handleShow}>Show WebGazer</button>
      <button className="btn btn-primary text-white font-bold py-2 px-4 rounded hover:bg-yellow-700 m-2" onClick={handleHide}>Hide WebGazer</button>
      <button className="btn text-white font-bold py-2 px-4 rounded hover:bg-red-700 m-2" onClick={handleStop}>Stop WebGazer</button>
      <button className="btn btn-primary text-white font-bold py-2 px-4 rounded hover:bg-purple-700 m-2" onClick={handleEnd}>End WebGazer</button>
      <div className="text-white text-4xl font-bold mt-8">
        <h1>Hello World</h1>
      </div>
    </div>
  );
};