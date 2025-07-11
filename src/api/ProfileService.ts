import { AxiosResponse } from 'axios';
import { User } from 'data/dto';

import { instance } from './api.config';

export const getMyProfile = (): Promise<AxiosResponse<User>> => {
  return instance.get('/users/my');
};

export const updateMyProfile = (data: User): Promise<AxiosResponse<User>> => {
  return instance.put('/users/my', data);
};
