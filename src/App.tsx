import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './utils/ProtectedRoute';

const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
      <Route path="/" element=<HomePage /> errorElement=<ErrorPage /> />
      <Route path="/login" element=<LoginPage /> errorElement=<ErrorPage /> />
      <Route path='/user/*' element={<ProtectedRoute />}>
        <Route index element=<DashboardPage /> errorElement=<ErrorPage /> />
      </Route>
		</Routes>
	</BrowserRouter>
);

export default App;
