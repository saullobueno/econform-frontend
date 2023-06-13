import { useAuth } from 'context/auth';

export function useCan({ access_role = {}, permission_role = {} }) {
  const { auth } = useAuth();

  if (!auth.isAuth) {
    return false;
  }

  if (permission_role?.length > 0) {
    const hasAllPermissions = permission_role.every((permission) => {
      return auth.permission_role.includes(permission);
    });
    if (!hasAllPermissions) {
      return false;
    }
  }

  if (access_role?.length > 0) {
    const hasAllRoles = access_role.some((role) => {
      return auth.access_role.includes(role);
    });
    if (!hasAllRoles) {
      return false;
    }
  }
  return true;
}
