"use client"

import { WebGazerManager } from '../contexts/webgaze/WebGazerManager'

export default function HomePage() {

  let webGazer = new WebGazerManager();

  const handleStart = () => {
    webGazer.start();
  };
  
  const handleHide = () => {
    webGazer.hide();
  };
  
  const handleShow = () => {
    webGazer.show();
  };

  const handleStop = () => {
    webGazer.stop();
  };
  
  const handleEnd = () => {
    webGazer.end();
    webGazer = new WebGazerManager();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 m-2" onClick={handleStart}>Start WebGazer</button>
      <button className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 m-2" onClick={handleShow}>Show WebGazer</button>
      <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-700 m-2" onClick={handleHide}>Hide WebGazer</button>
      <button className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 m-2" onClick={handleStop}>Stop WebGazer</button>
      <button className="bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 m-2" onClick={handleEnd}>End WebGazer</button>
      <div className="text-white text-4xl font-bold mt-8">
        <h1>Hello World</h1>
      </div>
    </div>
  );
};
