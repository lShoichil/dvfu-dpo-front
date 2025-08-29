import React, { memo, useEffect, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Badge, Collapse, CollapseProps, Flex, Result, Space, Spin, Steps, Tooltip } from 'antd';
import { User } from 'data/dto';

import { errorMessage } from 'api/MessageService';
import { getMyProfile, getResumeById, Resume, VerificationStatus } from 'api/ProfileService';

import AdditionalForm from './document-forms/AdditionalForm';
import { DocumentStatusTag } from './document-forms/components/DocumentStatusTag';
import { EducationForm } from './document-forms/EducationForm';
import { FioDocumentForm } from './document-forms/FioDocumentForm';
import OPDForm from './document-forms/OPDForm';
import PassportForm from './document-forms/PassportForm';
import SnilsForm from './document-forms/SnilsForm';

const ProfileDocumentPage = () => {
  const [data, setData] = useState<Resume>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [updateNeeded, setUpdateNeeded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const hasAnyReject =
    data?.document_on_change_of_surname?.status == VerificationStatus.REJECTED ||
    data?.education?.status == VerificationStatus.REJECTED ||
    data?.opd?.status == VerificationStatus.REJECTED ||
    data?.passport?.status == VerificationStatus.REJECTED ||
    data?.snils?.status == VerificationStatus.REJECTED;

  const hasAnyDocuments =
    data?.additional_information != null ||
    data?.document_on_change_of_surname != null ||
    data?.education != null ||
    data?.opd != null ||
    data?.passport !== null ||
    data?.snils != null;

  const items: CollapseProps['items'] = [
    {
      key: 'passport',
      label: 'Паспорт',
      extra: <DocumentStatusTag status={data?.passport?.status} />,
      children: <PassportForm id={user?.id || ''} data={data?.passport} setUpdateNeeded={setUpdateNeeded} />
    },
    {
      key: 'snils',
      label: 'СНИЛС',
      extra: <DocumentStatusTag status={data?.snils?.status} />,
      children: <SnilsForm id={user?.id || ''} data={data?.snils} setUpdateNeeded={setUpdateNeeded} />
    },
    {
      key: 'education',
      label: 'Диплом',
      extra: <DocumentStatusTag status={data?.education?.status} />,
      children: <EducationForm id={user?.id || ''} data={data?.education} setUpdateNeeded={setUpdateNeeded} />
    },
    {
      key: 'document_on_change_of_surname',
      label: 'Документ о смене ФИО',
      extra: <DocumentStatusTag status={data?.document_on_change_of_surname?.status} />,
      children: (
        <FioDocumentForm
          id={user?.id || ''}
          data={data?.document_on_change_of_surname}
          setUpdateNeeded={setUpdateNeeded}
        />
      )
    },
    {
      key: 'additional_information',
      label: 'Дополнительная информация',
      children: (
        <AdditionalForm id={user?.id || ''} data={data?.additional_information} setUpdateNeeded={setUpdateNeeded} />
      )
    },
    {
      key: 'opd',
      label: 'Согласие на обработку данных',
      extra: <DocumentStatusTag status={data?.opd?.status} />,
      children: <OPDForm id={user?.id || ''} data={data?.opd} setUpdateNeeded={setUpdateNeeded} />
    }
  ];

  const getData = () => {
    setUpdateNeeded(false);

    const { id } = user || {};
    if (!id) return errorMessage('id пользователя не найден');

    setLoading(true);
    getResumeById(id)
      .then(({ data }) => setData(data))
      .catch(errorMessage)
      .finally(() => setLoading(false));
  };

  const getUserData = () => {
    setLoading(true);
    getMyProfile()
      .then(({ data }) => {
        setUser(data);
        setUpdateNeeded(true);
      })
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  const getCurrentStep = () => {
    console.log(2, data);
    console.log(1, hasAnyDocuments);
    // console.log(1, hasAnyDocuments && data?.verify);
    if (hasAnyDocuments && !data?.verify) setCurrentStep(2);
    if (hasAnyDocuments && data?.verify) setCurrentStep(3);
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (updateNeeded) {
      getData();
      getCurrentStep();
    }
  }, [updateNeeded]);

  return (
    <Spin spinning={loading}>
      <Flex vertical gap={'middle'}>
        {hasAnyReject && !data?.verify && (
          <Result
            status="warning"
            title="У куратора есть замечания"
            subTitle={
              <Space direction="vertical">
                {data?.document_on_change_of_surname?.status === VerificationStatus.REJECTED && (
                  <Space>
                    <Badge status="warning" text="Документ о смене ФИО" />
                    <Tooltip title={data?.document_on_change_of_surname?.message}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                {data?.education?.status === VerificationStatus.REJECTED && (
                  <Space>
                    <Badge status="warning" text="Документ о смене ФИО" />
                    <Tooltip title={data?.education?.message}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                {data?.opd?.status === VerificationStatus.REJECTED && (
                  <Space>
                    <Badge status="warning" text="Документ о смене ФИО" />
                    <Tooltip title={data?.opd?.message}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                {data?.passport?.status === VerificationStatus.REJECTED && (
                  <Space>
                    <Badge status="warning" text="Документ о смене ФИО" />
                    <Tooltip title={data?.passport?.message}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                {data?.snils?.status === VerificationStatus.REJECTED && (
                  <Space>
                    <Badge status="warning" text="Документ о смене ФИО" />
                    <Tooltip title={data?.snils?.message}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
              </Space>
            }
          />
        )}

        <Steps
          current={currentStep}
          items={[
            {
              title: 'Авторизация',
              description: 'Регистрация в системе'
            },
            {
              title: 'Подача документов',
              description: 'Заполнения и отправка всего перечня документов ниже'
            },
            {
              title: 'Проверка документов',
              description: 'Выполняется проверка документов куратором'
            },
            {
              title: 'Успешная проверка',
              description: 'Можно записываться на программы!'
            }
          ]}
        />

        <Collapse items={items} defaultActiveKey={['1']} />

        {/* <Popconfirm
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
          {'Отправка'}
        </Button> */}
        {/* </Popconfirm> */}
      </Flex>
    </Spin>
  );
};

export default memo(ProfileDocumentPage);
