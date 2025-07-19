import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, MenuProps, Space, Typography } from 'antd';

import { errorMessage } from 'api/MessageService';
import { getMyProfile } from 'api/ProfileService';
import { useAuthStore } from 'stores/AuthAppStore';

const ExitDropdown = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setAuth(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const getData = () => {
    setLoading(true);
    getMyProfile()
      .then(({ data: { name = '', surname = '', patronymic = '' } }) => setData(`${surname} ${name} ${patronymic}`))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

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
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button
        loading={loading}
        size="large"
        type="text"
        iconPosition="start"
        icon={
          <Avatar
            size={28}
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
            icon={<UserOutlined />}
          />
        }
      >
        <Typography.Text type="secondary">{data}</Typography.Text>
      </Button>
    </Dropdown>
  );
};

export default memo(ExitDropdown);
