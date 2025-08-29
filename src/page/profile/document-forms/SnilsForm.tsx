import React, { FC } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { getReqRule } from 'utils';

import { errorMessage } from 'api/MessageService';
import { Passport, SnilsWithStatus, updateMySnils } from 'api/ProfileService';

import { AlertAboutDocument } from './components/AlertAboutDocument';

const { Item } = Form;

interface IProps {
  id: string;
  data?: SnilsWithStatus;
  setUpdateNeeded: (v: boolean) => void;
}

const SnilsForm: FC<IProps> = ({ id, data, setUpdateNeeded }) => {
  const [form] = Form.useForm();
  const initialValues = {
    number: data?.snils?.number
  };

  const handleSubmit = (values: any) => {
    const dto = {
      ...values
    } as Passport;

    updateMySnils(id, dto)
      .then(() => setUpdateNeeded(true))
      .catch(errorMessage);
  };

  return (
    <Form form={form} onFinish={handleSubmit} initialValues={initialValues} layout="vertical">
      {data?.message && (
        <Item>
          <AlertAboutDocument status={data?.status} message={data?.message} />
        </Item>
      )}

      <Row gutter={16}>
        <Col span={6}>
          <Item name="number" label="Номер СНИЛС" rules={[getReqRule()]}>
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

export default SnilsForm;
