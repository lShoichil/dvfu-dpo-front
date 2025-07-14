import React, { memo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Button, Flex, Input, Spin } from 'antd';
import { OTPProps } from 'antd/es/input/OTP';
import { User } from 'data/dto';

import AuthService from 'api/api.auth';
import { warnMessage } from 'api/MessageService';

const { OTP } = Input;

export interface SignUpPageForm extends User {
  password: string;
}

// todo: переделать на форму
const ActivatePage = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('user_id');
  const initialCode = searchParams.get('code') || '';
  const initialError = !id ? 'Нет id, перейдите по письму снова' : '';

  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!id) return;
    if (!code || code?.length < 6) {
      setError('Поле с кодом должно быть заполнено');
      return;
    }

    if (error) return;

    setError('');
    setLoading(true);
    AuthService.activate(id, code)
      .then(({ status }) => status === 200 && navigate('/login'))
      .catch(() => warnMessage('Не можем подвердить ваш аккаунт, попробуйте ещё раз позже.'))
      .finally(() => setLoading(false));
  };

  const onLogin = () => {
    navigate('/login');
  };

  const onInput: OTPProps['onInput'] = (value = []) => {
    const newValue = value.join('');
    if (newValue?.length === 6 && error) setError('');
    setCode(value.join(''));
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
        <h1>{'Активация'}</h1>

        <Flex vertical gap="middle">
          <OTP defaultValue={initialCode} onInput={onInput} />
          {error && <Alert message={error} type="error" showIcon />}

          <Button onClick={handleSubmit}>{'Активировать'}</Button>
        </Flex>
        <Flex align="center">
          <Button onClick={onLogin} type="link">
            {'Уже есть аккаунт?'}
          </Button>
        </Flex>
      </section>
    </Spin>
  );
};

export default memo(ActivatePage);
