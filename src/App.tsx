import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
      <Route path="/" element=<HomePage />/>
      <Route path="/login" element=<LoginPage />/>
      <Route path="/register" element=<RegisterPage />/>
      <Route path="/verify-email" element=<VerifyEmailPage />/>
      <Route path='/user/*' element={<ProtectedRoute />}>
        <Route index element=<DashboardPage />/>
      </Route>
		</Routes>
	</BrowserRouter>
);

export default App;
