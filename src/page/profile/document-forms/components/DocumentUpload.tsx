import { FC } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Flex, Typography, Upload, UploadFile, UploadProps } from 'antd';
import { saveToFile } from 'utils';

import { errorMessage, warnMessage } from 'api/MessageService';
import { getStorageData, uploadFile } from 'api/ProgramService';

interface IProps {
  handleSubmit?: (name: string) => void;
  setDocumentId?: (id: string) => void;
  defaultFileUid?: string;
  disabled?: boolean;
}

export const DocumentUpload: FC<IProps> = ({ handleSubmit, setDocumentId, defaultFileUid = '', disabled }) => {
  const defaultFileList: UploadFile[] = defaultFileUid
    ? [
        {
          uid: defaultFileUid,
          name: 'Предзагруженный вами документ',
          status: 'done'
        }
      ]
    : [];

  const handleDownloadDocument = ({ name, uid, response }: UploadFile<any>) => {
    const id = response?.name || uid;
    if (!id) return warnMessage('Отсутствует id документа.');

    getStorageData(id)
      .then(({ data, headers: { 'content-type': contentType } }) => saveToFile(data, name, contentType))
      .catch(errorMessage);
  };

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    defaultFileList,
    customRequest: (options) => {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append('file', file as Blob);

      uploadFile(formData)
        .then(({ data }) => {
          onSuccess?.(data);
          if (handleSubmit) handleSubmit(data?.name);
          if (setDocumentId) setDocumentId(data?.name);
        })
        .catch((e: Error) => {
          onError?.(e);
          errorMessage(e);
        });
    },
    itemRender: (originNode, file) => {
      return (
        <Flex justify="space-between">
          <Typography.Link onClick={() => handleDownloadDocument(file)}>{file.name}</Typography.Link>

          {/* @ts-ignore */}
          {originNode.props.children[2]}
        </Flex>
      );
    }
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />} disabled={disabled}>
        {'Загрузить необходимый документ'}
      </Button>
      {/* <Flex justify="center" align="center" vertical gap={'small'}>
        <InboxOutlined style={{ fontSize: 35, color: '#1677ff' }} />
        <Typography.Text>{'Кликните или перетащите необходимый документ'}</Typography.Text>
        <Typography.Text type="secondary">{'Заранее убедитесь что информация с него легко читается'}</Typography.Text>
      </Flex> */}
    </Upload>
  );
};
