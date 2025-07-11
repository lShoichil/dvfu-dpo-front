import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsProps } from 'antd';

import EducationTypePage from './EducationTypePage';
import SchoolPage from './SchoolPage';

export const DirectoryTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const preselectedTabKey = searchParams.get('tabKey') ?? 'schools';
  const [currentTabKey, setCurrentTabKey] = useState(preselectedTabKey);

  useEffect(() => {
    setSearchParams({ tabKey: currentTabKey });
  }, [currentTabKey, setSearchParams]);

  // todo: Переписать на одну компоненту и переиспользовать
  const tabPaneItems: TabsProps['items'] = [
    {
      key: 'schools',
      label: 'Школы',
      children: <SchoolPage />
    },
    {
      key: 'education-type',
      label: 'Тип образования',
      children: <EducationTypePage />
    }
  ];

  return (
    <Tabs
      style={{ height: '100%' }}
      centered
      tabPosition={'left'}
      items={tabPaneItems}
      onChange={setCurrentTabKey}
      activeKey={currentTabKey}
    />
  );
};
