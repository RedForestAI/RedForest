"use client";

import NavBar from "~/components/ui/navbar";
import PDFViewer from "./_components/reading_activity/pdf-viewer";
import { WebGazerManager } from '~/providers/WebGazerManager';

export default function Page() {
  const pdfUrl = 'https://arxiv.org/pdf/1708.08021.pdf'; // Replace with your PDF URL
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
    <div>
      <NavBar includeBurger={true} accountLink={"/access/account"} logoLink={"/access"}/>
      <div className="pt-20">
      <div className="pb-4 flex flex-row items-center justify-center">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 m-2" onClick={handleStart}>Start WebGazer</button>
        <button className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 m-2" onClick={handleShow}>Show WebGazer</button>
        <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-700 m-2" onClick={handleHide}>Hide WebGazer</button>
        <button className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 m-2" onClick={handleStop}>Stop WebGazer</button>
        <button className="bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 m-2" onClick={handleEnd}>End WebGazer</button>
      </div>
        <PDFViewer file={pdfUrl}/>
      </div>
    </div>
  )
}