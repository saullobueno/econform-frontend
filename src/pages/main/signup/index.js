import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from 'context/auth';
import { useLoading } from 'context/loading';

import * as Yup from 'yup';
import { Input } from 'components/Forms/Input';

import { RiCheckLine } from 'react-icons/ri';
import { Loading } from 'components/Loading';

import { Button, Center, Divider, Heading, Icon, Link, Text, VStack, HStack, Box } from '@chakra-ui/react';

const scheme = Yup.object({
  name: Yup.string().required('Nome obrigatório').min(2, 'Mínimo de 2 caracteres').max(255, 'Máximo de 255 caracteres'),
  email: Yup.string().required('Email obrigatório').email('Email inválido'),
  password: Yup.string()
    .required('Senha obrigatória')
    .min(6, 'Mínimo de 6 caracteres')
    .max(255, 'Máximo de 255 caracteres'),
  clientName: Yup.string()
    .required('Nome da empresa ou grupo obrigatória')
    .min(2, 'Mínimo de 2 caracteres')
    .max(255, 'Máximo de 255 caracteres'),
});

export default function SignUpPage() {
  const { auth, signUp } = useAuth();
  const { loading } = useLoading();
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(scheme),
  });

  const handleSignUp = (values) => {
    signUp(values);
  };

  return (
    <Box w={{ base: '100%', sm: '270px' }}>
      <Heading color="white" as="h3" fontSize="3xl">
        Olá!
      </Heading>
      <Text color="white" fontSize="sm" fontWeight="light" py="4">
        Bem vindo à plataforma eConform.
        <br />
        Para começar, cadastre-se preenchendo os campos abaixo:
      </Text>

      {isSubmitting || loading ? (
        <Loading show={true} w="100%" py="16" color="white" emptyColor="whiteAlpha.100" />
      ) : auth.isAuth ? (
        <Center w="100%" py="16">
          <Icon as={RiCheckLine} color="white" boxSize="16" />
        </Center>
      ) : (
        <VStack align="start" as="form" spacing="4" onSubmit={handleSubmit(handleSignUp)}>
          <Input name="name" label="Seu nome" darkMode register={register} />
          <Input name="email" label="E-mail" darkMode errors={errors} register={register} />
          <Input name="password" type="password" label="Senha" darkMode errors={errors} register={register} />
          <Input name="clientName" label="Nome da sua empresa ou grupo" darkMode errors={errors} register={register} />

          <Button type="submit" w="full" mt="4" isLoading={isSubmitting}>
            Cadastrar
          </Button>
        </VStack>
      )}

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
        onClick={() => navigate('/', { replace: true })}
        w="full"
        isLoading={isSubmitting}
      >
        Entrar na minha conta
      </Button>
    </Box>
  );
}

SignUpPage.propTypes = {
  router: PropTypes.object,
};
