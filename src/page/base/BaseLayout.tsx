import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  CommentOutlined,
  ContainerOutlined,
  FileProtectOutlined,
  FolderOpenOutlined,
  LogoutOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  SunOutlined,
  TableOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Button,
  Drawer,
  Dropdown,
  FloatButton,
  Form,
  Input,
  Layout,
  Menu,
  MenuProps,
  Modal,
  Segmented,
  Space,
  Typography
} from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { MenuItemType } from 'antd/es/menu/interface';

import { useAuthStore } from 'stores/AuthAppStore';

import styles from './BaseLayout.module.scss';

const { Item } = Form;
const { TextArea } = Input;

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
    key: 'streams-admin',
    icon: <TableOutlined />,
    label: 'Потоки (Админ)'
  },
  {
    key: 'programs-admin',
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
  const { setAuth } = useAuthStore();

  const defaultMenuKey = menuItems[0]?.key?.toString();
  const activeMenuKey = params?.pathname?.split('/')[2];

  useEffect(() => {
    navigate(defaultMenuKey);
  }, []);

  const handleLogout = () => {
    setAuth(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  // ...
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // ...
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // ...
  const [form] = Form.useForm();

  // ...

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a onClick={handleLogout}>
          <Space>
            <LogoutOutlined />
            {'Выйти'}
          </Space>
        </a>
      )
    }
  ];

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
          activeKey={activeMenuKey || defaultMenuKey}
          defaultSelectedKeys={[defaultMenuKey]}
          disabledOverflow
        />

        <Segmented
          shape="round"
          options={[
            { value: 'light', icon: <SunOutlined /> },
            { value: 'dark', icon: <MoonOutlined /> }
          ]}
        />

        <Dropdown menu={{ items }} placement="bottomRight">
          <Button
            size="large"
            type="text"
            iconPosition="start"
            icon={
              <Avatar
                className={styles.avatar}
                size={28}
                src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                icon={<UserOutlined />}
              />
            }
          >
            <Typography.Text type="secondary">{'Галимова Любовь Сергеевна'}</Typography.Text>
          </Button>
        </Dropdown>
      </Header>

      <Layout>
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ insetInlineEnd: 24 }}
          icon={<QuestionCircleOutlined />}
        >
          <FloatButton badge={{ count: 2, color: 'blue' }} icon={<QuestionCircleOutlined />} onClick={showDrawer} />
          <FloatButton icon={<CommentOutlined />} onClick={showModal} />
        </FloatButton.Group>

        <Content
          style={{
            background: 'white',
            paddingTop: '30px',
            minHeight: '280px'
          }}
        >
          <Drawer title="Уведомления" closable={{ 'aria-label': 'Close Button' }} onClose={onClose} open={open}>
            <Alert message="Проверка документов" description="Ваши документы прошли проверку!" type="info" />
            <br />
            <Alert
              message="Проверка документов"
              description="Куратор отклонил ваш СНИЛС, ознакомьтесь с замечанием"
              type="warning"
            />
          </Drawer>

          <Modal
            title={'Есть вопрос по платформе? Опишите его в форме ниже.'}
            centered
            open={isModalOpen}
            onOk={handleOk}
            okText="Отправить"
            cancelText="Отменить"
            onCancel={handleCancel}
          >
            <Form form={form}>
              <Item name="name" style={{ margin: 10 }}>
                <Input placeholder="Ваше имя" />
              </Item>
              <Item name="telephone" style={{ margin: 10 }}>
                <Input placeholder="Ваш телефон" />
              </Item>
              <Item name="email" style={{ margin: 10 }}>
                <Input placeholder="Ваш email" />
              </Item>
              <Item name="question" style={{ margin: 10 }}>
                <TextArea placeholder="Ваш вопрос" rows={4} />
              </Item>
              <Item style={{ margin: 10 }}>
                <p style={{ margin: 0 }}>
                  Отправляя вопрос, вы соглашаетесь с политикой конфиденциальности и даете согласие на обработку
                  персональных данных.
                </p>
              </Item>
            </Form>
          </Modal>

          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
