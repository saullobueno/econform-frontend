import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link as LinkDOM } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Link, Button, VStack, Heading, Text, Center, Icon, Divider, HStack, Box } from '@chakra-ui/react';

import { Input } from 'components/Forms/Input';
import { Loading } from 'components/Loading';

import { useAuth } from 'context/auth';
import { useLoading } from 'context/loading';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { RiCheckLine } from 'react-icons/ri';

const formValidators = Yup.object({
  email: Yup.string().required('Email obrigatório').email(),
  password: Yup.string().required('Senha obrigatória').min(6),
});

export default function SignInPage() {
  let navigate = useNavigate();
  const { auth, signIn } = useAuth();
  const { loading } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formValidators),
  });

  const handleSignIn = ({ email, password }) => {
    signIn({ email, password });
  };

  return (
    <Box w={{ base: '100%', sm: '270px' }}>
      {isSubmitting || loading ? (
        <Loading color="white" emptyColor="whiteAlpha.100" />
      ) : auth.isAuth ? (
        <Center w="100%" py="16">
          <Icon as={RiCheckLine} color="white" boxSize="16" />
        </Center>
      ) : (
        <>
          <Heading color="white" as="h1" size="lg" py="4">
            Olá!
          </Heading>
          <Text pb="4" fontWeight="light" fontSize="sm" color="white">
            Bem vindo à plataforma eConform.
            <br />
            Entre com seu login e senha abaixo:
          </Text>

          <Text pb="4" fontWeight="light" fontStyle="italic" fontSize="xs" color="gray.200">
            Importante: A plataforma eConform entrou em uma fase de atualização e o acesso está restrito apenas aos
            cadastros já existentes.
          </Text>

          <VStack align="start" as="form" spacing="4" onSubmit={handleSubmit(handleSignIn)}>
            <Input name="email" type="email" label="E-mail" darkMode errors={errors.email} register={register} />
            <Input
              name="password"
              type="password"
              label="Senha"
              darkMode
              errors={errors.password}
              register={register}
              helper={
                <Link as={LinkDOM} to="/forgot-password" color="white">
                  Esqueci a minha senha
                </Link>
              }
            />

            <Button type="submit" w="full" isLoading={isSubmitting}>
              Entrar
            </Button>
          </VStack>

          <HStack>
            <Divider color="white" />
            <Text color="white" align="center" py="2">
              ou
            </Text>
            <Divider color="white" />
          </HStack>

          <Button
            colorScheme="whiteAlpha"
            variant="outline"
            color="white"
            onClick={() => navigate('/signup', { replace: true })}
            w="full"
            isLoading={isSubmitting}
          >
            Criar conta
          </Button>
        </>
      )}
    </Box>
  );
}

SignInPage.propTypes = {
  router: PropTypes.object,
  decodedToken: PropTypes.object,
};
