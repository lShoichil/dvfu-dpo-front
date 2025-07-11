import { Rule } from 'rc-field-form/lib/interface';

export const getReqRule = (): Rule => ({
  required: true,
  message: 'Поле обязательно для заполнения'
});
