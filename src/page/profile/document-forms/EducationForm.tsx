import React, { FC, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Switch, Tooltip } from 'antd';
import { getReqRule, mapDate } from 'utils';

import { errorMessage, warnMessage } from 'api/MessageService';
import { EducationDocument, EducationDocumentWithStatus, updateMyEducation } from 'api/ProfileService';

import { AlertAboutDocument } from './components/AlertAboutDocument';
import { DocumentUpload } from './components/DocumentUpload';

const { Item } = Form;

interface IProps {
  id: string;
  data?: EducationDocumentWithStatus;
  setUpdateNeeded: (v: boolean) => void;
}

export const EducationForm: FC<IProps> = ({ id, data, setUpdateNeeded }) => {
  const [form] = Form.useForm();
  const [checked, setChecked] = useState<boolean>(true);
  const [documentId, setDocumentId] = useState(data?.education_document?.document);

  const { education_document } = data || {};
  const initialValues = {
    diploma: {
      ...education_document?.diploma,
      issue_date: mapDate(education_document?.diploma?.issue_date)
    },
    ...education_document,
    year_of_graduation: mapDate(education_document?.year_of_graduation)
  };

  const handleSubmit = (values: EducationDocument) => {
    if (!documentId) return warnMessage('Вы не приложили документ');

    const finalValues = { ...values, document: documentId };

    updateMyEducation(id, finalValues)
      .then(() => setUpdateNeeded(true))
      .catch(errorMessage);
  };

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Form form={form} onFinish={handleSubmit} initialValues={initialValues} layout="vertical">
      {data?.message && (
        <Item>
          <AlertAboutDocument status={data?.status} message={data?.message} />
        </Item>
      )}

      <Item>
        <Space>
          <DocumentUpload defaultFileUid={documentId} setDocumentId={setDocumentId} />

          <Switch
            checkedChildren="Прикладываю диплом"
            unCheckedChildren="Прикладываю справку"
            defaultChecked={checked}
            onChange={handleChange}
          />

          <Tooltip title="Если у вас нет диплома об образовании, выберите вариант справки">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      </Item>

      {checked ? (
        <Row gutter={16}>
          <Col span={6}>
            <Item name={['diploma', 'surname']} label="Фамилия" rules={[getReqRule()]}>
              <Input />
            </Item>
          </Col>
          <Col span={6}>
            <Item name={['diploma', 'number']} label="Номер" rules={[getReqRule()]}>
              <Input />
            </Item>
          </Col>
          <Col span={6}>
            <Item name={['diploma', 'series']} label="Серия" rules={[getReqRule()]}>
              <Input />
            </Item>
          </Col>

          <Col span={6}>
            <Item name={['diploma', 'issue_date']} label="Дата выпуска " rules={[getReqRule()]}>
              <DatePicker format={'DD.MM.YYYY'} />
            </Item>
          </Col>
        </Row>
      ) : (
        <Row gutter={16}>
          <Col span={6}>
            <Item name={'institution_name'} label="Название учреждения" rules={[getReqRule()]}>
              <Input />
            </Item>
          </Col>
          <Col span={6}>
            <Item name={'specialty'} label="Специальность" rules={[getReqRule()]}>
              <Input />
            </Item>
          </Col>
          <Col span={6}>
            <Item name={'type'} label="Тип" rules={[getReqRule()]}>
              <Select
                allowClear
                options={[
                  // { value: 'student', label: 'Студент' },
                  { value: 'bachelor', label: 'Бакалавриат' },
                  { value: 'specialty', label: 'Специалитет' },
                  { value: 'master', label: 'Магистратура' },
                  { value: 'average', label: 'Среднеспециальное' }
                ]}
              />
            </Item>
          </Col>
          <Col span={6}>
            <Item name={'year_of_graduation'} label="Ваш год выпуска" rules={[getReqRule()]}>
              <DatePicker format={'DD.MM.YYYY'} />
            </Item>
          </Col>
          <Col span={6}></Col>
        </Row>
      )}

      <Item>
        <Button type="primary" htmlType="submit">
          {'Отправить'}
        </Button>
      </Item>
    </Form>
  );
};
