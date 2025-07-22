import dayjs from 'dayjs';
import { Rule } from 'rc-field-form/lib/interface';

export const getReqRule = (): Rule => ({
  required: true,
  message: 'Поле обязательно для заполнения'
});

export const formatIntAmount = (num?: number | undefined | string): string | undefined => {
  if (num === undefined || num === null) {
    return '-';
  }

  return Math.round(parseFloat(String(num))).toLocaleString('ru');
};

export const mapDate = (date?: Date | string): string | undefined => {
  if (!date) {
    return '\n';
  }
  const result = dayjs(date);
  return result?.format('DD.MM.YYYY');
};
