import { AxiosResponse } from 'axios';
import { LoginForm } from 'page/auth/LoginPage.js';
import { SignUpPageForm } from 'page/auth/SignUpPage.js';

import { instance } from './api.config.js';

export interface Token {
  access_token: string;
  refresh_token: string;
  role: string;
  token_type: string;
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

  static signup(data: SignUpPageForm): Promise<AxiosResponse<{ id: string }>> {
    return instance.post('auth/signup', data);
  }

  static activate(id: string, code: string): Promise<AxiosResponse<{ id: string }>> {
    return instance.get(`auth/verify?id=${id}&code=${code}`);
  }
}
