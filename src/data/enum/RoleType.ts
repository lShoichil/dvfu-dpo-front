export enum RoleType {
  ADMINISTRATOR = 'administrator',
  CURATOR = 'curator',
  APPLICANT = 'applicant'
}

export const RoleTypeRu = {
  [RoleType.ADMINISTRATOR]: 'Администартор',
  [RoleType.CURATOR]: 'Куратор',
  [RoleType.APPLICANT]: 'Абитуриент'
};