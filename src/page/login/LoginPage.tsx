import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Spin, Tooltip } from 'antd';
import { getReqRule } from 'utils';

import AuthService from 'api/api.auth';
import { errorMessage } from 'api/MessageService';
import { useAuthStore } from 'stores/AuthAppStore';

const { Item } = Form;

export interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthInProgress, setAuth, setAuthInProgress } = useAuthStore();
  const [form] = Form.useForm();

  const handleSubmit = (values: LoginForm) => {
    setAuthInProgress(true);
    AuthService.login(values)
      .then(({ data }) => {
        setAuth(true);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        navigate('/home');
      })
      .catch(errorMessage)
      .finally(() => setAuthInProgress(false));
  };

  const initialValues = {
    email: 'admin@admin.admin',
    password: 'dpoadmin5202'
  };

  return (
    <Spin spinning={isAuthInProgress} delay={500}>
      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <h1>{'Авторизация'}</h1>
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={initialValues}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '400px'
          }}
        >
          <Item name="email" rules={[getReqRule()]}>
            <Input
              placeholder="Введите ваш email"
              prefix={<UserOutlined />}
              suffix={
                <Tooltip title="Input email">
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
            />
          </Item>

          <Item name={'password'} rules={[getReqRule()]}>
            <Input.Password
              placeholder="Введите пароль"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Item>

          <Button htmlType="submit">{'Войти'}</Button>
        </Form>
      </section>
    </Spin>
  );
};

export default LoginPage;
