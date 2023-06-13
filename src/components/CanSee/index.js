import React from 'react';
import { useCan } from 'hooks/useCan';

export function CanSee({ children, permission_role, access_role }) {
  const userCanSeeComponent = useCan({ permission_role, access_role });

  if (!userCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
}
