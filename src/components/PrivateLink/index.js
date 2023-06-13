import React from 'react';
import { useAuth } from 'context/auth';
import { Link } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function PrivateLink({ role, children, activeStyle, ...rest }) {
  const { auth } = useAuth();

  return auth.isAuth && role.includes(auth.access_role) ? (
    <Link
      as={NavLink}
      style={({ isActive }) => (isActive ? activeStyle : undefined)}
      _hover={{ textDecoration: 'none' }}
      {...rest}
    >
      {children}
    </Link>
  ) : null;
}
