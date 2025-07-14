import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Spin, Tooltip } from 'antd';
import { User } from 'data/dto';
import { getReqRule } from 'utils';

import AuthService from 'api/api.auth';
import { warnMessage } from 'api/MessageService';

const { Item } = Form;

export interface SignUpPageForm extends User {
  password: string;
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  const countDown = () => {
    let secondsToGo = 10;

    const instance = modal.success({
      title: 'Отлично! Последний шаг - подтверждение почты. Уже выслали вам письмо!',
      content: `Это окно закроется через ${secondsToGo} сек.`
    });

    const timer = setInterval(() => {
      secondsToGo -= 1;
      instance.update({
        content: `Это окно закроется через ${secondsToGo} сек.`
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
    }, secondsToGo * 1000);
  };

  const onLogin = () => {
    navigate('/login');
  };

  const handleSubmit = (values: SignUpPageForm) => {
    setLoading(true);
    AuthService.signup(values)
      .then(({ data }) => data?.id && countDown())
      .finally(() => setLoading(false));
  };

  const initialValues = {
    email: 'leningdenis@gmail.com',
    password: '123'
  };

  return (
    <Spin spinning={loading} delay={500}>
      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <h1>{'Регистрация'}</h1>
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={initialValues}
          onFinishFailed={() => warnMessage('Заполнены не все обязательные поля')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '400px'
          }}
        >
          <Item name="email" rules={[getReqRule()]}>
            <Input
              placeholder="Введите ваш email"
              allowClear
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
              allowClear
              placeholder="Введите пароль"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Item>

          <Item name="name" rules={[getReqRule()]}>
            <Input allowClear placeholder="Введите ваше имя" prefix={<UserOutlined />} />
          </Item>

          <Item name="surname" rules={[getReqRule()]}>
            <Input allowClear placeholder="Введите вашу фамилию" prefix={<UserOutlined />} />
          </Item>

          <Item name="patronymic">
            <Input allowClear placeholder="Введите ваш отчество" prefix={<UserOutlined />} />
          </Item>

          <Button htmlType="submit">{'Зарегистрироваться'}</Button>

          <Button onClick={onLogin} type="link">
            {'Уже есть аккаунт?'}
          </Button>
        </Form>
      </section>
      {contextHolder}
    </Spin>
  );
};

export default memo(SignUpPage);
