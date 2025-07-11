import { message } from 'antd';

export const successMessage = () => {
  message.success('Выполнено успешно');
};

export const warnMessage = (text: string) => {
  message.warning(text);
};

export const errorMessage = (error?: any) => {
  console.error('error', error);
  message.error(`Произошла ошибка: ${error?.response?.message || 'Неизвестная ошибка'} (${error?.response?.status})`);
};

export const serverBadRequestMessage = (error: Error, detail?: unknown) => {
  console.error('serverBadRequest', error, detail);
  message.error(`Ошибка в запросе к серверу: ${JSON.stringify(detail as object, null, 3)} ; error: ${error.message}`);
};

export const internalAppErrorMessage = (error: string) => {
  console.error('internalAppError', error);
  message.error(`Внутренняя ошибка приложения: ${error}`);
};
