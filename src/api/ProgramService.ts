import { AxiosResponse } from 'axios';
import { PageDto, Program } from 'data/dto';

import { instance } from './api.config';

export const getAllPrograms = (params: string): Promise<AxiosResponse<PageDto<Program>>> => {
  return instance.get('/programs' + params);
};

export const getProgramImage = (imageUrl: string): Promise<AxiosResponse<any>> => {
  return instance.options('/storage/' + imageUrl);
};