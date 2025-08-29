import { FC } from 'react';
import { Alert } from 'antd';

import { VerificationStatus } from 'api/ProfileService';

interface IProps {
  message?: string;
  status?: VerificationStatus;
}

export const AlertAboutDocument: FC<IProps> = ({ message, status }) => {
  if (status !== VerificationStatus.REJECTED) return null;
  return <Alert message="Замечание от куратора" description={message} type="warning" showIcon />;
};
