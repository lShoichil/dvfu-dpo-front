export interface User {
  id: string;
  role: string;
  email: string;

  name: string;
  surname: string;
  patronymic: string;

  verify: boolean;
  deleted: boolean;
}
