import { AxiosResponse } from 'axios';
import { PageDto, Thread } from 'data/dto';
import { TreadDto } from 'page/threads/ThreadModal';

import { instance } from './api.config';

export const getAllTreads = (params: string): Promise<AxiosResponse<PageDto<Thread>>> => {
  return instance.get('/treads' + params);
};

export const createTread = (data: TreadDto): Promise<AxiosResponse> => {
  return instance.post('/treads', data);
};

export const deleteTread = (id: string): Promise<AxiosResponse> => {
  return instance.delete(`/treads/${id}`);
};

export const closeTread = (id: string): Promise<AxiosResponse> => {
  return instance.patch(`/treads/${id}/close`);
};
