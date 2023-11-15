// AssignmentPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { WebGazerManager } from '../contexts/webgaze/WebGazerManager'
import './css/AssignmentPage.css';

const AssignmentPage = () => {
  const { id } = useParams<{ id: string }>();
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
    <div className="assignment-page">
      <ResponsiveAppBar />
      <button onClick={handleStart}>Start WebGazer</button>
      <button onClick={handleShow}>Show WebGazer</button>
      <button onClick={handleHide}>Hide WebGazer</button>
      <button onClick={handleStop}>Stop WebGazer</button>
      <button onClick={handleEnd}>End WebGazer</button>
      <div className='pdf-viewer-container'>
        <PDFViewer />
      </div>
    </div>
  );
};

export default AssignmentPage;
