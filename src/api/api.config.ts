import axios from 'axios';

import { useAuthStore } from 'stores/AuthAppStore';

import AuthService from './api.auth';
import { errorMessage, internalAppErrorMessage, serverBadRequestMessage } from './MessageService';

export const instance = axios.create({
  baseURL: 'http://51.250.1.29:8080/api/v1/'
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
  return config;
});

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
    if (
      // проверим, что ошибка именно из-за невалидного accessToken
      status === 401 &&
      // проверим, что запрос не повторный
      error.config &&
      !error.config._isRetry
    ) {
      try {
        // запрос на обновление токенов
        const refresh_token = localStorage.getItem('refresh_token') || '';
        const { setAuth, setAuthInProgress } = useAuthStore();

        setAuthInProgress(true);
        AuthService.refresh(refresh_token)
          .then(({ data }) => {
            setAuth(true);
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
          })
          .catch(errorMessage)
          .finally(() => setAuthInProgress(false));

        // переотправляем запрос с обновленным accessToken
        return instance.request(originalRequest);
      } catch (error) {
        console.log('AUTH ERROR', error);
      }
    }

    // на случай, если возникла другая ошибка (не связанная с авторизацией)
    // пробросим эту ошибку
    throw error;
  }
);
