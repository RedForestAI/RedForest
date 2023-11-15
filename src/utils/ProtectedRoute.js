import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

function ProtectedRoute() {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authStore.isAuth) {
      navigate('/login');
    }
  }, [authStore.isAuth, navigate]);

  return <Outlet />;
}

export default ProtectedRoute;
