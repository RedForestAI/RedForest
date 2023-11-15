// AssignmentPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import './css/AssignmentPage.css';

import { WebGazeProvider } from '../components/webgaze/WebGazeContext';

const AssignmentPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="assignment-page">
      <WebGazeProvider>
        <ResponsiveAppBar />
        <div className='pdf-viewer-container'>
          <PDFViewer />
        </div>
      </WebGazeProvider>
    </div>
  );
};

export default AssignmentPage;
