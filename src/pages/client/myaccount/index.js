import React, { useCallback, useEffect, useState } from 'react';
import { ClientMyAccount } from 'services';
import { useAuth } from 'context/auth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useToast, Button, ButtonGroup, VStack, VisuallyHiddenInput, Box, Flex, SimpleGrid } from '@chakra-ui/react';

import Breadcrumbs from 'components/Breadcrumbs';
import { Content, Paper } from 'components/Content';
import { Loading } from 'components/Loading';
import { Input } from 'components/Forms/Input';
import { Radio } from 'components/Forms/Radio';
import { Checkbox } from 'components/Forms/Checkbox';

import Delete from './delete';

const schema = Yup.object({
  name: Yup.string().required('Nome obrigatório').min(2, 'Mínimo de 2 caracteres').max(255, 'Máximo de 255 caracteres'),
  email: Yup.string().required('Email obrigatório').email('Email inválido'),
  password: Yup.string(),
  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais.'),
  systemRole: Yup.string().required('Tipo de usuário obrigatório'),
  enabled: Yup.number(),
});

export default () => {
  const toast = useToast();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleteItem, setDeleteItem] = useState(0);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(schema) });

  const handleConstruct = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await ClientMyAccount.readItem(auth.id);
      reset({ ...data, password: '' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Não foi possível carregar o usuário.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
  }, [auth, reset]);

  const handleOnSubmit = useCallback(
    async (data) => {
      data.password === ''
        ? (data = {
            name: data.name,
            email: data.email,
            systemRole: data.systemRole,
            enabled: data.enabled,
          })
        : data;

      try {
        await ClientMyAccount.updateItem(data);
        toast({
          title: 'Usuário alterado',
          status: 'success',
          isClosable: true,
        });
        setTimeout(() => {
          reset();
        }, 1000);
      } catch (error) {
        toast({
          title: 'Não foi possível alterar o usuário.',
          description: error.response.data.message
            ? error.response.data.message
            : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
          status: 'error',
          isClosable: true,
        });
      }
    },
    [auth, reset]
  );

  useEffect(() => {
    if (auth.id > 0) {
      handleConstruct();
    }
  }, [auth, handleConstruct]);

  return (
    <>
      <Breadcrumbs
        title="Minha conta"
        pages={[{ page: localStorage.getItem('@eConform-ClientName') || 'Início', link: '/client/dashboard' }]}
      />
      <Content>
        <Paper title="Meu perfil" loading={isSubmitting || loading} fluid>
          {!loading && !isSubmitting && (
            <VStack as="form" id="formRef" onSubmit={handleSubmit(handleOnSubmit)} spacing="8" align="stretch">
              <SimpleGrid minChildWidth={{ base: '320px', '6xl': '380px' }} spacing="8">
                <Input name="name" label="Nome" errors={errors} register={register} />
                <Input name="email" label="E-mail" errors={errors} register={register} />
                <VisuallyHiddenInput name="password" register={register} />
                <Radio
                  name="systemRole"
                  label="Tipo de usuário"
                  minChildWidth="120px"
                  getValues={getValues}
                  defaultValue="ADMIN"
                  options={[
                    { label: 'Administrador', value: 'ADMIN' },
                    { label: 'Usuário', value: 'USER' },
                  ]}
                  isDisabled={auth.access_role === 'PARTNER' || auth.access_role === 'USER'}
                  register={register}
                  errors={errors}
                />
                <Checkbox
                  name="enabled"
                  label="Status"
                  switchoption={true}
                  getValues={getValues}
                  options={[{ label: 'Ativo', value: 1 }]}
                  register={register}
                  errors={errors}
                />
              </SimpleGrid>
              <Flex justify="end">
                <ButtonGroup spacing="4">
                  <Button type="submit" isLoading={isSubmitting}>
                    Salvar
                  </Button>
                  <Button colorScheme="red" onClick={() => setDeleteItem(auth.id)}>
                    Excluir conta
                  </Button>
                </ButtonGroup>
              </Flex>
            </VStack>
          )}
        </Paper>
        <Paper title="Alterar senha" fluid>
          {!loading && !isSubmitting && (
            <VStack as="form" id="formRef" onSubmit={handleSubmit(handleOnSubmit)} spacing="8" align="stretch">
              <SimpleGrid minChildWidth={{ base: '320px', '6xl': '380px' }} spacing="8">
                <Input name="password" type="password" label="Senha" errors={errors} register={register} />
                <Input
                  name="passwordConfirmation"
                  type="password"
                  label="Confirmar senha"
                  errors={errors}
                  register={register}
                />
                <VisuallyHiddenInput name="name" register={register} />
                <VisuallyHiddenInput name="email" register={register} />
                <VisuallyHiddenInput name="systemRole" register={register} />
                <VisuallyHiddenInput name="enabled" register={register} />
              </SimpleGrid>
              <Flex justify="end">
                <ButtonGroup spacing="4" justify="end">
                  <Button type="submit" isLoading={isSubmitting}>
                    Alterar senha
                  </Button>
                </ButtonGroup>
              </Flex>
            </VStack>
          )}
        </Paper>
      </Content>
      <Delete
        id={deleteItem}
        isOpen={!!deleteItem}
        onClose={() => {
          setDeleteItem(0);
        }}
      />
    </>
  );
};
