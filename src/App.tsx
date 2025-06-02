import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import { Button, Empty } from 'antd';
import PrivateRoute from 'navigate/PrivateRoute';

import { useAuthStore } from 'stores/AuthAppStore';

import './App.css';

const App = () => {
  const navigate = useNavigate();
  const { login, updateByRefresh } = useAuthStore();

  useEffect(() => {
    updateByRefresh(navigate);
  }, [updateByRefresh]);

  const onClick = () => {
    login('curator1', 'curator1').then(() => navigate('/home'));
  };

  return (
    <Routes>
      <Route path="/login" element={<Empty description={<Button onClick={onClick}>Login</Button>} />} />

      <Route path="/home" element={<PrivateRoute />}>
        <Route index element={<Empty description={'yra pobeda'} />} />
      </Route>

      <Route path="*" element={<div>404... not found </div>} />
    </Routes>
  );
};

export default App;
