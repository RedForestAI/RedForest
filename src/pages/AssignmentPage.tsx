// AssignmentPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { WebGazeProvider } from '../components/webgaze/WebGazerContext';
import './css/AssignmentPage.css';

const AssignmentPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
      <div className="assignment-page">
        <ResponsiveAppBar />
        <div className='pdf-viewer-container'>
          <PDFViewer />
        </div>
      </div>
  );
};

export default AssignmentPage;
