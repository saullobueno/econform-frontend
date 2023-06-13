import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from 'services/api';
import { useNavigate, Link as LinkDOM } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Input } from 'components/Forms/Input';
import { Loading } from 'components/Loading';

import { RiCheckLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { useToast, Box, Button, Divider, Heading, Link, Text, VStack, Icon, HStack } from '@chakra-ui/react';

const scheme = Yup.object({
  email: Yup.string().required().email(),
});

export default function ForgotPasswordPage() {
  let navigate = useNavigate();
  const [loading, setLoading] = useState();
  const [sent, setSent] = useState(false);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(scheme),
  });

  const handleOnSubmit = useCallback(async (data) => {
    setLoading(true);
    const response = await api.post(`/api/v1/system/user/reset-password`, { username: data.email });
    if (response.data.code === 'email-nao-existe') {
      toast({
        title: 'Email não encontrado',
        description: response.data.message
          ? response.data.message
          : 'Não existe cadastro com este email. Confira se digitou o email correto e tente novamente.',
        status: 'error',
        isClosable: true,
      });
      setLoading(false);
    } else {
      setSent(true);
      toast({
        title: 'Instruções enviadas',
        description: 'Acesse seu email e siga as instruções para alterar sua senha.',
        status: 'success',
        isClosable: true,
      });
      navigate('/', { replace: true });
      setLoading(false);
    }
  }, []);

  return (
    <Box w={{ base: '100%', sm: '270px' }}>
      <Heading as="h3" color="white" size="lg" fontWeight="semibold">
        Esqueci minha senha
      </Heading>
      {isSubmitting || loading ? (
        <Loading />
      ) : sent ? (
        <Box color="white">
          <RiCheckLine style={{ margin: '0 auto', width: '7rem', height: '7rem' }} />
          <Heading textAlign="center" as="h6" size="xs" fontWeight="semibold">
            Instruções enviadas
          </Heading>
          <Text textAlign="center" fontSize="sm" fontWeight="thin" pt="1rem">
            Confira a caixa de entrada do seu email e siga as instruções de acesso à plataforma.
          </Text>
        </Box>
      ) : (
        <>
          <Text color="white" fontSize="sm" fontWeight="thin" pt="1rem">
            Digite o email cadastrado para receber as instruções de acesso à plataforma.
          </Text>

          <VStack align="start" as="form" spacing="4" py="2rem" onSubmit={handleSubmit(handleOnSubmit)}>
            <Input name="email" label="E-mail" darkMode errors={errors} register={register} />
            <Button type="submit" w="full" isLoading={isSubmitting}>
              Enviar
            </Button>
          </VStack>
        </>
      )}

      <HStack w="100%" justify="space-between" fontSize="sm" color="white">
        <Link as={LinkDOM} to="/">
          <Icon as={RiArrowLeftSLine} /> Entrar
        </Link>

        <Link as={LinkDOM} to="/signup">
          Criar conta <Icon as={RiArrowRightSLine} />
        </Link>
      </HStack>
    </Box>
  );
}

ForgotPasswordPage.propTypes = {
  router: PropTypes.object,
};
