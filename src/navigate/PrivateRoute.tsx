import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from 'stores/AuthAppStore';

const PrivateRoute = () => {
  const { isAuth, isAuthInProgress } = useAuthStore();

  if (isAuthInProgress || (!isAuth && !isAuthInProgress)) return <div>Checking auth...</div>;

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
