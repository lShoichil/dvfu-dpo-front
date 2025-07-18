import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ContainerOutlined,
  FileProtectOutlined,
  FolderOpenOutlined,
  MoonOutlined,
  SunOutlined,
  TableOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, Segmented } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { MenuItemType } from 'antd/es/menu/interface';

import ExitDropdown from 'components/base-layout/ExitDropdown';
import NotificationDrawer from 'components/base-layout/NotificationDrawer';

const menuItems: MenuItemType[] = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: 'Мой профиль'
  },
  {
    key: 'directory',
    icon: <ContainerOutlined />,
    label: 'Справочники'
  },
  {
    key: 'applications',
    icon: <FileProtectOutlined />,
    label: 'Заявки'
  },
  {
    key: 'streams',
    icon: <TableOutlined />,
    label: 'Потоки (Админ)'
  },
  {
    key: 'programs',
    icon: <FolderOpenOutlined />,
    label: 'Программы'
  },
  {
    key: 'users',
    icon: <TeamOutlined />,
    label: 'Пользователи'
  }
];

const BaseLayout = () => {
  const params = useLocation();
  const navigate = useNavigate();

  const defaultMenuKey = 'profile';
  const activeMenuKey = params?.pathname?.split('/')[2];
  const activeKey = activeMenuKey || defaultMenuKey;

  useEffect(() => {
    navigate(activeKey);
  }, []);

  return (
    <Layout style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Header
        style={{
          justifyContent: 'space-between',
          alignContent: 'center',
          padding: 0,
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <Menu
          items={menuItems}
          theme="light"
          mode="horizontal"
          onClick={({ key }) => navigate(key)}
          activeKey={activeKey}
          defaultSelectedKeys={[activeKey]}
        />

        <Segmented
          shape="round"
          options={[
            { value: 'light', icon: <SunOutlined /> },
            { value: 'dark', icon: <MoonOutlined /> }
          ]}
        />

        <ExitDropdown />
      </Header>

      <Layout>
        <NotificationDrawer />

        <Content
          style={{
            background: 'white',
            paddingTop: '30px',
            minHeight: '280px'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
