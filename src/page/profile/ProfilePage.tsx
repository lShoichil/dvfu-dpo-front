import React, { memo, useEffect, useState } from 'react';
import { CloudUploadOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Divider, Flex, Form, Input, Radio, Row, Select, Spin } from 'antd';
import { User } from 'data/dto';
import { getReqRule } from 'utils';

import { errorMessage, warnMessage } from 'api/MessageService';
import { getMyProfile, updateMyProfile } from 'api/ProfileService';

const { Option } = Select;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    getMyProfile()
      .then(({ data }) => form.setFieldsValue(data))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  const onFinish = (values: User) => {
    setLoading(true);
    updateMyProfile(values)
      .then(({ data }) => form.setFieldsValue(data))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={() => warnMessage('Заполнены не все обязательные поля')}
      >
        <Flex justify="space-between" wrap>
          <Col span={10}>
            <Divider orientation="left">{'Основная информация'}</Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Фамилия" name="surname" rules={[getReqRule()]}>
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Имя" name="name" rules={[getReqRule()]}>
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Отчество" name="patronymic">
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input prefix={<MailOutlined />} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Номер телефона" name="phone">
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="БИО" name="bio">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Divider orientation="left">{'Дополнительная информация'}</Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="verify" label="Статус профиля" tooltip="Подверждает профиль куратор">
                  <Radio.Group disabled>
                    <Radio value={true}>{'Подтверждён'}</Radio>
                    <Radio value={false}>{'Hе подтверждён'}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Роль" name="role">
                  <Select>
                    <Option value="Администратор">{'Администратор'}</Option>
                    <Option value="Куратор">{'Куратор'}</Option>
                    <Option value="Абитуриент">{'Абитуриент'}</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Должность" name="post">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                {'Обновить данные '}
              </Button>
            </Form.Item>
          </Col>

          <Col span={10}>
            <Divider orientation="left">{'Аватар'}</Divider>
            <Flex vertical justify="center" align="center" gap={'small'}>
              <Avatar
                size={128}
                src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                icon={<UserOutlined />}
              />

              <Button type="default" size="small" icon={<CloudUploadOutlined />} iconPosition="start" htmlType="submit">
                {'Обновить аватарку'}
              </Button>
            </Flex>
          </Col>
        </Flex>
      </Form>
    </Spin>
  );
};

export default memo(ProfilePage);
