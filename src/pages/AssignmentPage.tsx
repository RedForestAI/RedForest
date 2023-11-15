// AssignmentPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { getWebGazerInstance } from '../contexts/webgaze/WebGazerManager'
import './css/AssignmentPage.css';

const AssignmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const webGazer = getWebGazerInstance();

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
    };

  return (
    <div className="assignment-page">
      <ResponsiveAppBar />
      <div className='pdf-viewer-container'>
        <PDFViewer />
      </div>
      <button onClick={handleStart}>Start WebGazer</button>
      <button onClick={handleShow}>Show WebGazer</button>
      <button onClick={handleHide}>Hide WebGazer</button>
      <button onClick={handleStop}>Stop WebGazer</button>
      <button onClick={handleEnd}>End WebGazer</button>
    </div>
  );
};

export default AssignmentPage;
