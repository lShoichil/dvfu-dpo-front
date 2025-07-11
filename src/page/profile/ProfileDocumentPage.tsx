import React, { memo } from 'react';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Button, Flex, Popconfirm, Result, Space, Steps, Typography, Upload, UploadFile } from 'antd';

const ProfileDocumentPage = () => {
  const fileList: UploadFile[] = [
    {
      uid: '0',
      name: 'Паспорт.pdf',
      status: 'uploading',
      percent: 33
    },
    {
      uid: '1',
      name: 'СНИЛС.pdf',
      status: 'done'
    },
    {
      uid: '2',
      name: 'Документ об образовании.pdf',
      status: 'done'
    },
    {
      uid: '3',
      name: 'Документ о смене имени/фамилии.pdf',
      status: 'done'
    },
    {
      uid: '4',
      name: 'Согласие на обработку ПД.pdf',
      status: 'done'
    }
  ];

  return (
    <Flex vertical>
      <Result
        status="warning"
        title="Проблема с одним из ваших документов"
        subTitle="Ваш СНИЛС отклонён по причине ..., прикрепите правильный документ и повторно отправьте на проверку"
        extra={
          <Popconfirm
            title="Вы уверены что прикрепили все документы из перечня?"
            description={
              <Space direction="vertical">
                <Badge status="processing" text="Паспорт" />
                <Badge status="processing" text="СНИЛС" />
                <Badge status="processing" text="Документ об образовании" />
                <Badge status="processing" text="Документ о смене имени/фамилии" />
                <Badge status="processing" text="Согласие на обработку ПД" />
              </Space>
            }
            okText="Да"
            cancelText="Нет"
          >
            <Button type="primary" key="console">
              {'Повторная отправка'}
            </Button>
          </Popconfirm>
        }
      />
      <Steps
        current={1}
        status="error"
        items={[
          {
            title: 'Авторизация',
            status: 'finish',
            icon: <UserOutlined />
          },
          {
            title: 'Подача документов',
            status: 'finish',
            icon: <SolutionOutlined />
          },
          {
            title: 'Проверка документов',
            status: 'process',
            description: <Typography.Text type="secondary">{'Проверку проводит куратор'}</Typography.Text>,
            icon: <LoadingOutlined />
          },
          {
            title: 'Успешная проверка',
            status: 'wait',
            icon: <SmileOutlined />
          }
        ]}
      />
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture"
        defaultFileList={fileList}
      >
        <Button type="primary" icon={<UploadOutlined />}>
          {'Добавить документ'}
        </Button>
      </Upload>
    </Flex>
  );
};

export default memo(ProfileDocumentPage);
