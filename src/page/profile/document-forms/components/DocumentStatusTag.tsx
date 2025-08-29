import React, { FC } from 'react';
import { CheckCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

import { VerificationStatus } from 'api/ProfileService';

interface IProps {
  status?: VerificationStatus;
}

export const DocumentStatusTag: FC<IProps> = ({ status }) => {
  let text;
  let color;
  let icon;
  if (status === undefined) {
    text = 'Информация ещё не была загружена';
    icon = undefined;
    color = 'cyan';
  }
  if (status === VerificationStatus.NEW) {
    text = 'На проверке у куратора';
    icon = <SyncOutlined spin />;
    color = 'processing';
  }
  if (status === VerificationStatus.VERIFIED) {
    text = 'Верифицировано';
    icon = <CheckCircleOutlined />;
    color = 'success';
  }
  if (status === VerificationStatus.REJECTED) {
    text = 'Есть замечания';
    icon = <ExclamationCircleOutlined />;
    color = 'warning';
  }

  return (
    <Tag icon={icon} color={color}>
      {text}
    </Tag>
  );
};
