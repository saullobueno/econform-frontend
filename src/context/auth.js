import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from 'services/api';
import { SystemUser, AdminClient } from 'services';
import { useLocation, useNavigate } from 'react-router-dom';
import jwt from 'jsonwebtoken';

import { useToast } from '@chakra-ui/react';
import { useLoading } from 'context/loading';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const toast = useToast();
  const [auth, setAuth] = useState({ isAuth: false, name: '' });
  const { setLoading } = useLoading();
  let navigate = useNavigate();
  let location = useLocation();
  const sideAuth = location.pathname.split('/')[1];

  useEffect(() => {
    try {
      const token = localStorage.getItem('@eConform.token');
      if (token) {
        let decodedToken = jwt.verify(token, 'secretKey');
        api.defaults.headers.Authorization = token;
        setAuth({
          isAuth: true,
          id: decodedToken.id,
          uid: decodedToken.uid,
          current_client_id: decodedToken.current_client_id,
          token: token,
          name: decodedToken.name,
          email: decodedToken.username,
          access_role: decodedToken.access_role,
          permission_role: decodedToken.permission_role,
          side: sideAuth,
        });
      }
    } catch (err) {
      localStorage.clear();
      toast({
        title: err?.message === 'invalid token' ? 'Sessão expirada.' : 'Entre novamente na sua conta.',
        status: 'info',
        isClosable: true,
      });
    }
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      let { data } = await SystemUser.signIn({
        username: email,
        password: password,
      });
      localStorage.setItem('@eConform.token', data.access_token);
      api.defaults.headers.Authorization = data.access_token;
      let decodedToken = jwt.verify(data.access_token, 'secretKey');
      await setTimeout(
        () =>
          setAuth({
            isAuth: true,
            id: decodedToken.id,
            uid: decodedToken.uid,
            current_client_id: decodedToken.current_client_id,
            token: data.access_token,
            name: decodedToken.name,
            email: decodedToken.username,
            access_role: decodedToken.access_role,
            permission_role: decodedToken.permission_role,
          }),
        1000
      );
      toast({
        title: 'Login realizado',
        status: 'success',
        isClosable: true,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Erro na autenticação! Tente novamente mais tarde.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
      localStorage.clear();
    }
  }, []);

  const signUp = useCallback(async (values) => {
    setLoading(true);
    try {
      const { data } = await SystemUser.signUp({ ...values, password: '#Eco123' });

      /* localStorage.setItem('@eConform.token', data.access_token);
      api.defaults.headers.Authorization = data.access_token;
      let decodedToken = jwt.verify(data.access_token, 'secretKey');

      await setTimeout(
        () =>
          setAuth({
            isAuth: true,
            id: decodedToken.id,
            uid: decodedToken.uid,
            current_client_id: decodedToken.current_client_id,
            token: data.access_token,
            name: decodedToken.name,
            email: decodedToken.username,
            access_role: decodedToken.access_role,
            permission_role: decodedToken.permission_role,
          }),
        1000
      ); */

      toast({
        title: 'Cadastro realizado Redirecionando para a plataforma...',
        status: 'success',
        isClosable: true,
      });

      navigate('/platform-under-update', { replace: true });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Erro no cadastro! Tente novamente mais tarde.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      setAuth({
        isAuth: false,
        name: '',
      });
      localStorage.clear();
      setLoading(false);
      toast({
        title: 'Sessão encerrada.',
        status: 'info',
        isClosable: true,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setLoading(false);
      console.error('ERROR: ', err);
    }
  }, []);

  const signInManager = useCallback(async (id) => {
    try {
      setLoading(true);
      const { data } = await AdminClient.managerItem(id);
      localStorage.setItem('@eConform.token', data.access_token);
      api.defaults.headers.Authorization = `Bearer ${data.access_token}`;

      let decodedToken = jwt.verify(data.access_token, 'secretKey');
      localStorage.setItem('@eConform-ClientName', decodedToken.client_name);

      await setTimeout(
        () =>
          setAuth({
            isAuth: true,
            id: decodedToken.id,
            uid: decodedToken.uid,
            current_client_id: decodedToken.current_client_id,
            token: data.access_token,
            name: decodedToken.name,
            email: decodedToken.username,
            access_role: decodedToken.access_role,
            permission_role: decodedToken.permission_role,
          }),
        1000
      );

      toast({
        title: 'Cliente carregado!',
        status: 'success',
        isClosable: true,
      });
      setLoading(false);
      navigate('/client/dashboard', { replace: true });
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Não foi possível carregar a administração deste cliente.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, signIn, signUp, signOut, signInManager }}>{children}</AuthContext.Provider>
  );
};
