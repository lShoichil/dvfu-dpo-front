import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Empty } from 'antd';
import PrivateRoute from 'navigate/PrivateRoute';
import BaseLayout from 'page/base/BaseLayout';
import { DirectoryTabs } from 'page/directory/DirectoryTabs';
import LoginPage from 'page/login/LoginPage';
import { ProfilePageTabs } from 'page/profile/ProfilePageTabs';
import StreamAdminPage from 'page/stream/StreamAdminPage';
import UserTable from 'page/users/UserTable';

import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
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
