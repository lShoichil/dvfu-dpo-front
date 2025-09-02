import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Flex, Modal, Popconfirm, Row, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { DocumentUpload } from 'page/profile/document-forms/components/DocumentUpload';
import { SecureImage } from 'page/programs/components/ProgramSecureImage';

import { IModalProps } from './PrivateThreadModal';

const PublicThreadModal: FC<IModalProps> = ({ thread: programData, open, setOpen }) => {
  const navigate = useNavigate();

  const benefitsOptions = [
    {
      label: 'Людям с инвалидностью (Удостоверение инвалида)',
      value: '0',
      emoji: '10000 ₽',
      desc: 'Людям с инвалидностью (Удостоверение инвалида)'
    },
    {
      label: 'Преподавателям вузов (Удостоверение преподавателя)',
      value: 'teachers',
      emoji: '8000 ₽',
      desc: 'Преподавателям вузов (Удостоверение преподавателя)'
    }
  ];
  // "benefits": [
  //         {
  //           "document_name": "string",
  //           "name": "string",
  //           "price": {
  //             "penny": 0,
  //             "rubles": 0
  //           }
  //         }
  //       ],

  const handleSelectChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onOk = () => {
    console.log('go');
  };

  const onCancel = () => {
    setOpen(false);
  };

  const onCancelPopconfirm = () => {
    setOpen(false);
    navigate('/home/profile?tabKey=documents');
  };

  return (
    <Modal
      title={'Записаться на поток программы'}
      okText={'Записаться'}
      onOk={onOk}
      onCancel={onCancel}
      open={open}
      width={700}
      footer={
        <Popconfirm
          title="Запись на поток"
          description="Вы уверены что прикрепили все необходимые документы в профиле и прошли верификацию?"
          okText="Да, подать заявление"
          cancelText="Нет, нужно прикрепить"
          onCancel={onCancelPopconfirm}
        >
          <Button type={'primary'}>Записаться</Button>
        </Popconfirm>
      }
    >
      <div style={{ padding: 20 }}>
        {programData?.program?.image && (
          <Card
            cover={<SecureImage imagePath={programData?.program?.image} alt={''} />}
            variant={'borderless'}
            styles={{
              body: {
                padding: 0
              }
            }}
          />
        )}

        <Typography.Title level={3} style={{ marginBottom: 20, textAlign: 'center' }}>
          {programData?.program.name}
        </Typography.Title>

        {/* Основная информация в карточках */}
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card size="small" title="Основная информация">
              <p>
                <strong>Школа:</strong> {programData?.program.school.name}
              </p>
              <p>
                <strong>Тип обучения:</strong> {programData?.program.education_type.name}
              </p>
              <p>
                <strong>Формат:</strong> {programData?.program.study_mode === 'distance' ? 'Дистанционный' : 'Очный'}
              </p>
              <p>
                <strong>Часы:</strong> {programData?.program.academic_hours} ак. часов
              </p>
            </Card>
          </Col>

          <Col span={12}>
            <Card size="small" title="Даты и стоимость">
              <p>
                <strong>Начало:</strong> {dayjs(programData?.start_date)?.format('DD.MM.YYYY')}
              </p>
              <p>
                <strong>Окончание:</strong> {dayjs(programData?.finish_date)?.format('DD.MM.YYYY')}
              </p>
              <p>
                <strong>Участников:</strong> до {programData?.max_members}
              </p>
              <p>
                <strong>Стоимость:</strong> {programData?.price.rubles.toLocaleString('ru-RU')} руб.{' '}
                {programData?.price.penny} коп.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Описание */}
        {programData?.program.description && (
          <Card size="small" title="Описание программы" style={{ marginTop: 16 }}>
            <Typography.Paragraph>{programData?.program.description}</Typography.Paragraph>
          </Card>
        )}

        <Card size="small" title="Дополнительные опции" style={{ marginTop: 16 }}>
          <Flex vertical gap={'small'}>
            <Select
              popupMatchSelectWidth={false}
              placeholder="Выберите свою льготы и приложите соотвествующий документ"
              allowClear
              onChange={handleSelectChange}
              options={benefitsOptions}
              optionRender={(option) => (
                <Space>
                  <span role="img" aria-label={option.data.label}>
                    {option.data.emoji}
                  </span>
                  {option.data.desc}
                </Space>
              )}
            />

            <DocumentUpload />
          </Flex>

          {/* <Row gutter={16}>
            <Col span={8}>
              <p>
                <strong>Статус:</strong>
              </p>
              <Tag color={programData?.status === 'actual' ? 'green' : 'red'}>
                {programData?.status === 'actual' ? 'Актуальная' : 'Завершена'}
              </Tag>
            </Col>
            <Col span={8}>
              <p>
                <strong>Оферта:</strong> {programData?.program.offer_pay ? '✅ Да' : '❌ Нет'}
              </p>
              <p>
                <strong>Договор:</strong> {programData?.program.contract_pay ? '✅ Да' : '❌ Нет'}
              </p>
            </Col>
            <Col span={8}>
              <p>
                <strong>Публичная:</strong> {programData?.public ? '✅ Да' : '❌ Нет'}
              </p>
            </Col>
          </Row> */}
        </Card>
      </div>
    </Modal>
  );
};

export default PublicThreadModal;
