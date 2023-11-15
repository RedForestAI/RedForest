import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';

// Contexts
import { WebGazeProvider } from './components/webgaze/WebGazerContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AssignmentPage from './pages/AssignmentPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {

  useEffect(() => {
    // Set the title when the location (route) changes
    document.title = 'SandCastleReader';
  }, []);

  return (
    <WebGazeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/user/*" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="assignments/:id" element={<AssignmentPage />} />
            {/* Catch-all route for 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Catch-all route for 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </WebGazeProvider>
  );
};

export default App;
