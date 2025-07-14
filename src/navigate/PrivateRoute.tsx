import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

import AuthService from 'api/api.auth';
import { useAuthStore } from 'stores/AuthAppStore';

const PrivateRoute = () => {
  const navigate = useNavigate();
  const { isAuth, isAuthInProgress, setAuth, setAuthInProgress } = useAuthStore();

  useEffect(() => {
    const refresh_token = localStorage.getItem('refresh_token') || '';
    setAuthInProgress(true);
    AuthService.refresh(refresh_token)
      .then(({ data }) => {
        setAuth(true);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('role', data.role);
      })
      .catch(() => navigate('/login'))
      .finally(() => setAuthInProgress(false));
  }, []);

  if (isAuthInProgress || (!isAuth && !isAuthInProgress)) return <div></div>;

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
