import { UserRoles } from '../../role/entities/role.entity';

export const hasRole = (
  rolesFromJWT: UserRoles[] | null,
  role: UserRoles,
): boolean => rolesFromJWT && rolesFromJWT.includes(role);
