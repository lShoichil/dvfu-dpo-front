import { AxiosResponse } from 'axios';
import { User } from 'data/dto';

import { instance } from './api.config';

export const getUser = (id: number): Promise<AxiosResponse<User>> => {
  return instance.get(`/users/${id}`);
};

export const getUsers = (): Promise<AxiosResponse<{ users: User[] }>> => {
  return instance.get('/users');
};

export const updateUser = (id: number, data: User): Promise<AxiosResponse<User>> => {
  return instance.put(`/users/${id}}`, data);
};

export const deleteUser = (id: string): Promise<AxiosResponse<User>> => {
  return instance.delete(`/users/${id}`);
};
