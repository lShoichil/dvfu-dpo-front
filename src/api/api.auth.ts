import { AxiosResponse } from 'axios';
import { LoginForm } from 'page/login/LoginPage.js';

import { instance } from './api.config.js';

export interface Token {
  access_token: string;
  refresh_token: string;
  type: string;
}

export default class AuthService {
  static login(values: LoginForm): Promise<AxiosResponse<Token>> {
    return instance.post('auth/login', values);
  }

  static refresh(refresh_token: string): Promise<AxiosResponse<Token>> {
    return instance.post('auth/refresh', { refresh_token });
  }

  static logout(refresh_token: string): Promise<AxiosResponse<Token>> {
    return instance.post('auth/logout', { refresh_token });
  }
}
