import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
            <Route path="/" element=<HomePage /> errorElement=<ErrorPage /> />
            <Route path="/login" element=<LoginPage /> errorElement=<ErrorPage /> />
            <Route path="/dashboard" element=<DashboardPage /> errorElement=<ErrorPage /> />
		</Routes>
	</BrowserRouter>
);

export default App;
