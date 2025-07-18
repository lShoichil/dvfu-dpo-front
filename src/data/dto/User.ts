import { RoleType } from 'data/enum';

export interface User {
  id: string;
  role: RoleType;
  email: string;

  name: string;
  surname: string;
  patronymic: string;

  verify: boolean;
  deleted: boolean;
}
