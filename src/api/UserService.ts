import { AxiosResponse } from 'axios';
import { PageDto, User } from 'data/dto';

import { instance } from './api.config';

export const getUser = (id: number): Promise<AxiosResponse<User>> => {
  return instance.get(`/users/${id}`);
};

export const getUsers = (params: string): Promise<AxiosResponse<PageDto<User>>> => {
  return instance.get('/users' + params);
};

export const updateUser = (id: string, data: User): Promise<AxiosResponse<User>> => {
  return instance.put(`/users/${id}}`, data);
};

export const deleteUser = (id: string): Promise<AxiosResponse<User>> => {
  return instance.delete(`/users/${id}`);
};
