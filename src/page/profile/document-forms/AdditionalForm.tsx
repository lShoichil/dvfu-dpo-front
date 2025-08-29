import React, { FC } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';

import { errorMessage } from 'api/MessageService';
import { AdditionalInformation, updateMyAdditionalInfo } from 'api/ProfileService';

const { Item } = Form;

interface IProps {
  id: string;
  data?: AdditionalInformation;
  setUpdateNeeded: (v: boolean) => void;
}

const AdditionalForm: FC<IProps> = ({ id, data, setUpdateNeeded }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: AdditionalInformation) => {
    updateMyAdditionalInfo(id, values)
      .then(() => setUpdateNeeded(true))
      .catch((e) => errorMessage(e));
  };

  return (
    <Form form={form} onFinish={handleSubmit} initialValues={data} layout="vertical">
      <Row gutter={16}>
        <Col span={6}>
          <Item name="job_title" label="Должность">
            <Input />
          </Item>
        </Col>
        <Col span={6}>
          <Item name="organization" label="Организация">
            <Input />
          </Item>
        </Col>
        <Col span={6}>
          <Item name="phone" label="Номер телефона">
            <Input />
          </Item>
        </Col>
      </Row>

      <Item>
        <Button type="primary" htmlType="submit">
          {'Отправить'}
        </Button>
      </Item>
    </Form>
  );
};

export default AdditionalForm;
