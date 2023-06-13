import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'context/auth';

import { useToast } from '@chakra-ui/react';

import MainExceptionAccessRestrictedPage from 'pages/main/exceptions/access-restricted';

export default function ProtectedRoute({ children, role }) {
  const { auth } = useAuth();
  const [token, setToken] = useState(!!localStorage.getItem('@eConform.token'));
  const toast = useToast();

  if (!auth?.isAuth && !token) {
    return (
      toast({
        title: 'Acesso restrito',
        description: 'É necessário entrar em uma conta para acessar as àreas internas da plataforma',
        status: 'error',
        isClosable: true,
      }),
      (<Navigate to="/" replace={true} />)
    );
  }

  if (auth?.isAuth && !role?.includes(auth?.access_role)) {
    return (
      toast({
        title: 'Acesso restrito.',
        description: 'Você não tem permissão para entrar nesta página. Contate o administrador.',
        status: 'error',
        isClosable: true,
      }),
      (<MainExceptionAccessRestrictedPage />)
    );
  }

  return children ? children : <Outlet />;
}
