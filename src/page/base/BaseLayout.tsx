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
import { Layout, Menu, Segmented, Space } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { MenuItemType } from 'antd/es/menu/interface';
import { useHasRole } from 'hooks/useHasRole';
import ExitDropdown from 'page/base/components/ExitDropdown';
import NotificationDrawer from 'page/base/components/NotificationDrawer';

const BaseLayout = () => {
  const params = useLocation();
  const navigate = useNavigate();

  const defaultMenuKey = 'profile';
  const activeMenuKey = params?.pathname?.split('/')[2];
  const activeKey = activeMenuKey || defaultMenuKey;

  useEffect(() => {
    navigate(activeKey);
  }, []);

  const { hasRoleAdmin, hasRoleCurator } = useHasRole();
  const getMenuItems = (): MenuItemType[] => {
    const adminMenu: MenuItemType[] = [
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
        key: 'threads',
        icon: <TableOutlined />,
        label: 'Потоки'
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

    const curatorMenu = [
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
        key: 'threads',
        icon: <TableOutlined />,
        label: 'Потоки'
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

    const applicantMenu: MenuItemType[] = [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Мой профиль'
      },
      // {
      //   key: 'directory',
      //   icon: <ContainerOutlined />,
      //   label: 'Справочники'
      // },
      // {
      //   key: 'applications',
      //   icon: <FileProtectOutlined />,
      //   label: 'Заявки'
      // },
      {
        key: 'threads',
        icon: <TableOutlined />,
        label: 'Программы'
      }
      // {
      //   key: 'programs',
      //   icon: <FolderOpenOutlined />,
      //   label: 'Программы'
      // },
      // {
      //   key: 'users',
      //   icon: <TeamOutlined />,
      //   label: 'Пользователи'
      // }
    ];

    if (hasRoleAdmin) return adminMenu;
    if (hasRoleCurator) return curatorMenu;
    return applicantMenu;
  };

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
          items={getMenuItems()}
          theme="light"
          mode="horizontal"
          onClick={({ key }) => navigate(key)}
          activeKey={activeKey}
          defaultSelectedKeys={[activeKey]}
          disabledOverflow={true}
        />

        <Space wrap>
          <Segmented
            shape="round"
            options={[
              { value: 'light', icon: <SunOutlined /> },
              { value: 'dark', icon: <MoonOutlined /> }
            ]}
          />

          <ExitDropdown />
        </Space>
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
