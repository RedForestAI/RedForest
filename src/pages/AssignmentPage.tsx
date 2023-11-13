// AssignmentPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer'; // Import the PDFViewer component
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import './css/AssignmentPage.css'

interface AssignmentPageProps {
  // Define any additional props you might need
}

const AssignmentPage: React.FC<AssignmentPageProps> = () => {
  const { id } = useParams<{ id: string }>(); // Get the assignment ID from the URL params

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
