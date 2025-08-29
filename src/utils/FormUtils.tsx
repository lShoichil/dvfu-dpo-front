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

export const mapDate = (date: Date | string | undefined): dayjs.Dayjs | undefined => {
  if (date == undefined) return undefined;
  return dayjs(date, 'DD.MM.YYYY');
};
