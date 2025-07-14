import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Empty } from 'antd';
import PrivateRoute from 'navigate/PrivateRoute';
import ActivatePage from 'page/auth/ActivatePage';
import LoginPage from 'page/auth/LoginPage';
import SignUpPage from 'page/auth/SignUpPage';
import BaseLayout from 'page/base/BaseLayout';
import { DirectoryTabs } from 'page/directory/DirectoryTabs';
import { ProfilePageTabs } from 'page/profile/ProfilePageTabs';
import StreamAdminPage from 'page/stream/StreamAdminPage';
import UserTable from 'page/users/UserTable';

import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="sign-up" element={<SignUpPage />} />
      <Route path="activate" element={<ActivatePage />} />
      <Route element={<PrivateRoute />}>
        <Route path="home" element={<BaseLayout />}>
          <Route path="profile" element={<ProfilePageTabs />} />
          <Route path="applications" element={<Empty />} />
          <Route path="directory" element={<DirectoryTabs />} />
          <Route path="streams-admin" element={<StreamAdminPage />} />
          <Route path="programs-admin" element={<Empty />} />
          <Route path="users" element={<UserTable />} />
        </Route>
      </Route>

      <Route index element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default App;
