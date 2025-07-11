import { AxiosResponse } from 'axios';

import { instance } from './api.config';

export const getAllPrograms = (): Promise<AxiosResponse<any>> => {
  return instance.get('/programs?page=1&page_size=100');
};
