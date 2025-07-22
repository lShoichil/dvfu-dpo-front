import { RoleType } from 'data/enum';

export const useHasRole = () => {
  const role = localStorage.getItem('role');

  const hasRoleAdmin = role === RoleType.ADMINISTRATOR;
  const hasRoleCurator = role === RoleType.CURATOR;
  const hasRoleApplicant = role === RoleType.APPLICANT;

  return {
    hasRoleAdmin,
    hasRoleCurator,
    hasRoleApplicant
  };
};
