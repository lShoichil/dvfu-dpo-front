import React, { FC } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { getReqRule } from 'utils';

import { errorMessage } from 'api/MessageService';
import { Gender, Passport, PassportWithStatus, updateMyPassport } from 'api/ProfileService';

const { Item } = Form;

interface IProps {
  id: string;
  data?: PassportWithStatus;
  setUpdateNeeded: (v: boolean) => void;
}

const PassportForm: FC<IProps> = ({ id, data, setUpdateNeeded }) => {
  const [form] = Form.useForm();
  const initialValues = {
    ...data?.passport,
    issuedBy: data?.passport?.issued_by,
    issuedWhen: data?.passport?.issued_when,
    departmentСode: data?.passport?.department_code,
    dateOfBirth: data?.passport?.date_of_birth,
    placeOfBirth: data?.passport?.place_of_birth
  };

  const handleSubmit = (values: any) => {
    const dto = {
      ...values,
      issued_by: values?.issuedBy,
      issued_when: dayjs(values?.issued_when).format('DD.MM.YYYY'),
      department_code: values?.departmentСode,
      date_of_birth: dayjs(values?.dateOfBirth).format('DD.MM.YYYY'),
      place_of_birth: values?.placeOfBirth
    } as Passport;

    updateMyPassport(id, dto)
      .then(() => setUpdateNeeded(true))
      .catch((e) => errorMessage(e));
  };

  return (
    <Form form={form} onFinish={handleSubmit} initialValues={initialValues} layout="vertical">
      <Row gutter={16}>
        <Col span={6}>
          <Item name="surname" label="Фамилия" rules={[getReqRule()]}>
            <Input />
          </Item>
        </Col>
        <Col span={6}>
          <Item name="name" label="Имя" rules={[getReqRule()]}>
            <Input />
          </Item>
        </Col>
        <Col span={6}>
          <Item name="patronymic" label="Отчество">
            <Input />
          </Item>
        </Col>
        <Col span={6}>
          <Item name="nationality" label="Национальность" rules={[getReqRule()]}>
            <Input />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col>
          <Item name="number" label="Номер" rules={[getReqRule()]}>
            <Input />
          </Item>
        </Col>
        <Col>
          <Item name="series" label="Серия" rules={[getReqRule()]}>
            <Input />
          </Item>
        </Col>
        <Col>
          <Item name="issuedBy" label="Кем выдан" rules={[getReqRule()]}>
            <Input />
          </Item>
        </Col>
        <Col>
          <Item name="issuedWhen" label="Когда выдан" rules={[getReqRule()]}>
            <DatePicker format={'DD.MM.YYYY'} />
          </Item>
        </Col>
        <Col>
          <Item name="departmentСode" label="Код подразделения" rules={[getReqRule()]}>
            <Input />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col>
          <Item name="dateOfBirth" label="Дата рождения" rules={[getReqRule()]}>
            <DatePicker format={'DD.MM.YYYY'} />
          </Item>
        </Col>
        <Col>
          <Item name="placeOfBirth" label="Место рождения" rules={[getReqRule()]}>
            <Input />
          </Item>
        </Col>
        <Col>
          <Item name="gender" label="Пол" rules={[getReqRule()]}>
            <Select
              options={[
                { value: Gender.MALE, label: 'М' },
                { value: Gender.FEMALE, label: 'Ж' }
              ]}
            />
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

export default PassportForm;
