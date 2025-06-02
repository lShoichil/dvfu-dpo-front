import { AxiosResponse } from 'axios';

import { instance } from './api.config.js';

export interface Token {
  access_token: string;
  refresh_token: string;
  type: string;
}

export default class AuthService {
  static login(username: string, password: string): Promise<AxiosResponse<Token>> {
    return instance.post('/api/v1/signin', { username, password });
  }

  static refresh(refresh_token: string): Promise<AxiosResponse<Token>> {
    return instance.post('/api/v1/refresh', { refresh_token });
  }

  static logout(refresh_token: string): Promise<AxiosResponse<Token>> {
    return instance.post('/api/v1/logout', { refresh_token });
  }
}
