import axios from 'axios';

import AuthService from './api.auth';
import { errorMessage, internalAppErrorMessage, serverBadRequestMessage } from './MessageService';

export const baseURL = 'https://dpo-ed.dvfu.ru/api/v1/';
export const instance = axios.create({ baseURL });

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
  return config;
});

async function refreshAuthToken(refresh_token: string) {
  try {
    const { data } = await AuthService.refresh(refresh_token);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('role', data.role);
    return data.access_token;
  } catch (e) {
    errorMessage(e);
    throw e;
  }
}

instance.interceptors.response.use(
  // в случае валидного accessToken ничего не делаем:
  (config) => config,
  // в случае просроченного accessToken пытаемся его обновить:
  async (error) => {
    const { status } = error?.response || {};
    if ([400, 409].includes(status)) return serverBadRequestMessage(error, error.response?.data);
    if (status === 500) return internalAppErrorMessage(error?.message);

    // предотвращаем зацикленный запрос, добавляя свойство _isRetry
    const originalRequest = { ...error.config };
    originalRequest._isRetry = true;

    // проверим, что ошибка именно из-за невалидного accessToken и что запрос не повторный
    if (status === 401 && error.config && !error.config._isRetry) {
      try {
        const refresh_token = localStorage.getItem('refresh_token') || '';
        const newAccessToken = await refreshAuthToken(refresh_token);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance.request(originalRequest);
      } catch (error) {
        console.log('AUTH ERROR', error);
      }
    }

    // на случай другой ошибки
    throw error;
  }
);
