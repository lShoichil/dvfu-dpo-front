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
import ProgramPage from 'page/programs/ProgramPage';
import ThreadsPage from 'page/threads/ThreadsPage';
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
          <Route path="applications" element={<Empty description="В процессе разработки" />} />
          <Route path="directory" element={<DirectoryTabs />} />
          <Route path="threads" element={<ThreadsPage />} />
          <Route path="programs" element={<ProgramPage />} />
          <Route path="users" element={<UserTable />} />
        </Route>
      </Route>

      <Route index element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default App;
