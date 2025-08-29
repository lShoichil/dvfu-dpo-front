import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Empty, Tabs, TabsProps } from 'antd';
import { useHasRole } from 'hooks/useHasRole';
import MyProgramPage from 'page/programs/MyProgramPage';

import ProfileDocumentPage from './ProfileDocumentPage';
import ProfilePage from './ProfilePage';

export const ProfilePageTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const preselectedTabKey = searchParams.get('tabKey') ?? 'info';
  const [currentTabKey, setCurrentTabKey] = useState(preselectedTabKey);

  const { hasRoleApplicant } = useHasRole();

  useEffect(() => {
    setSearchParams({ tabKey: currentTabKey });
  }, [currentTabKey, setSearchParams]);

  const tabPaneItems: TabsProps['items'] = hasRoleApplicant
    ? [
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
      ]
    : [
        {
          key: 'info',
          label: 'Информация о пользователе',
          children: <ProfilePage />
        }
      ];

  return <Tabs type="card" items={tabPaneItems} onChange={setCurrentTabKey} activeKey={currentTabKey} />;
};
