import React, { FC } from 'react';
import { Flex } from 'antd';

import { errorMessage, successMessage, warnMessage } from 'api/MessageService';
import { DocumentOnChangeOfSurname, updateMySurnameChange } from 'api/ProfileService';

import { AlertAboutDocument } from './components/AlertAboutDocument';
import { DocumentUpload } from './components/DocumentUpload';

interface IProps {
  id: string;
  data?: DocumentOnChangeOfSurname;
  setUpdateNeeded: (v: boolean) => void;
}

export const FioDocumentForm: FC<IProps> = ({ id, data, setUpdateNeeded }) => {
  const handleSubmit = (documentName: string) => {
    if (!documentName) return warnMessage('Вы не приложили документ');

    updateMySurnameChange(id, { name: documentName })
      .then(() => {
        successMessage();
        setUpdateNeeded(true);
      })
      .catch(errorMessage);
  };

  return (
    <Flex gap="middle" vertical>
      <AlertAboutDocument status={data?.status} message={data?.message} />
      <DocumentUpload handleSubmit={handleSubmit} defaultFileUid={data?.document} />
    </Flex>
  );
};
