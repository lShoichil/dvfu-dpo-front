import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Empty, Tabs, TabsProps } from 'antd';
import MyProgramPage from 'page/programs/MyProgramPage';

import ProfileDocumentPage from './ProfileDocumentPage';
import ProfilePage from './ProfilePage';

export const ProfilePageTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const preselectedTabKey = searchParams.get('tabKey') ?? 'documents';
  const [currentTabKey, setCurrentTabKey] = useState(preselectedTabKey);

  useEffect(() => {
    setSearchParams({ tabKey: currentTabKey });
  }, [currentTabKey, setSearchParams]);

  const tabPaneItems: TabsProps['items'] = [
    {
      key: 'info',
      label: 'Информация о пользователе',
      children: <ProfilePage />
    },
    {
      key: 'my-programs',
      label: 'Моё обучение',
      children: <MyProgramPage />
    },
    {
      key: 'documents',
      label: 'Мои документы',
      children: <ProfileDocumentPage />
    },
    {
      key: 'history',
      label: 'История изменений',
      children: <Empty />
    }
  ];

  return <Tabs type="card" items={tabPaneItems} onChange={setCurrentTabKey} activeKey={currentTabKey} />;
};
