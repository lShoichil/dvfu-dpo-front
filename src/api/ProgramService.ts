import { AxiosResponse } from 'axios';
import { PageDto, Program } from 'data/dto';

import { instance } from './api.config';

export const getAllPrograms = (params: string): Promise<AxiosResponse<PageDto<Program>>> => {
  return instance.get('/programs' + params);
};

export const getProgram = (id: string): Promise<AxiosResponse<Program>> => {
  return instance.get(`/programs/${id}`);
};

export const deleteProgram = (id: string): Promise<AxiosResponse<Program>> => {
  return instance.delete(`/programs/${id}`);
};

// todo: added storage api service
export const getStorageData = (imageUrl: string): Promise<AxiosResponse> => {
  return instance.get('/storage/' + imageUrl, { responseType: 'blob' });
};

export const uploadFile = (data: FormData): Promise<AxiosResponse<{ name: string }>> => {
  return instance.post('/files/upload', data);
};
