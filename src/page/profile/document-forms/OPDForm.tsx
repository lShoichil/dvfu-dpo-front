import React, { FC, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Checkbox, CheckboxProps, Flex, Space, Typography } from 'antd';
import { saveToFile } from 'utils';

import { errorMessage, successMessage, warnMessage } from 'api/MessageService';
import { getOPDId, OPDWithStatus, updateMyOPD } from 'api/ProfileService';
import { getStorageData } from 'api/ProgramService';

import { AlertAboutDocument } from './components/AlertAboutDocument';
import { DocumentUpload } from './components/DocumentUpload';

interface IProps {
  id: string;
  data?: OPDWithStatus;
  setUpdateNeeded: (v: boolean) => void;
}

const OPDForm: FC<IProps> = ({ id, data, setUpdateNeeded }) => {
  const [checked, setChecked] = useState(false);

  const handleSubmit = (documentName: string) => {
    if (!documentName) return warnMessage('Вы не приложили документ');

    updateMyOPD(id, { name: documentName })
      .then(() => {
        successMessage();
        setUpdateNeeded(true);
      })
      .catch(errorMessage);
  };

  const downloadActualOpd = (id: string) => {
    getStorageData(id)
      .then(({ data, headers: { 'content-type': contentType } }) => saveToFile(data, 'Шаблон ОПД', contentType))
      .catch(errorMessage);
  };

  const handleDownloadTemplate = () => {
    getOPDId().then(({ data }) => downloadActualOpd(data?.Name));
  };

  const onChange: CheckboxProps['onChange'] = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Flex gap="middle" vertical>
      <AlertAboutDocument status={data?.status} message={data?.message} />

      <Checkbox onChange={onChange} defaultChecked={checked}>
        <Typography.Paragraph style={{ margin: 0 }}>
          <Typography.Text>Я ознакомлен (а) с </Typography.Text>
          <Typography.Link
            href="https://www.dvfu.ru/upload/medialibrary/3f6/Политика%20обработки%20персональных%20данных%20в%20ДВФУ.pdf"
            target="_blank"
          >
            Политикой обработки персональных данных ДВФУ
          </Typography.Link>
        </Typography.Paragraph>
      </Checkbox>

      <Space.Compact>
        <Button onClick={handleDownloadTemplate} icon={<DownloadOutlined />}>
          {'Скачать шаблон'}
        </Button>
        <DocumentUpload handleSubmit={handleSubmit} defaultFileUid={data?.opd?.document} disabled={!checked} />
      </Space.Compact>
    </Flex>
  );
};

export default OPDForm;
