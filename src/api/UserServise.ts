import { AxiosResponse } from 'axios';
import { User } from 'data/dto';
import { PageDto } from 'utils';

import { instance } from './api.config';

interface DataType extends PageDto {
  users: User[];
}

export const getUser = (id: number): Promise<AxiosResponse<User>> => {
  return instance.get(`/users/${id}`);
};

export const getUsers = (params: string): Promise<AxiosResponse<DataType>> => {
  return instance.get('/users' + params);
};

export const updateUser = (id: number, data: User): Promise<AxiosResponse<User>> => {
  return instance.put(`/users/${id}}`, data);
};

export const deleteUser = (id: string): Promise<AxiosResponse<User>> => {
  return instance.delete(`/users/${id}`);
};
