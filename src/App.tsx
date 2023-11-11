import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
            <Route path="/" element=<HomePage /> errorElement=<ErrorPage /> />
		</Routes>
	</BrowserRouter>
);

export default App;
