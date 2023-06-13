import React, { useCallback, useEffect, useState } from 'react';
import { AdminUser } from 'services';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useToast, Button, ButtonGroup, VStack } from '@chakra-ui/react';

import Modal from 'components/Modal';
import { Input } from 'components/Forms/Input';
import { Radio } from 'components/Forms/Radio';
import { Checkbox } from 'components/Forms/Checkbox';

const schema = Yup.object({
  name: Yup.string().required('Nome obrigatório').min(2, 'Mínimo de 2 caracteres').max(255, 'Máximo de 255 caracteres'),
  email: Yup.string().required('Email obrigatório').email('Email inválido'),
  systemRole: Yup.string().required('Tipo de usuário obrigatório'),
});

export default ({ id, isOpen = false, onClose = () => {} }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(schema) });

  const handleConstruct = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await AdminUser.readItem(id);
      reset({ ...data, password: '' });
    } catch (error) {
      toast({
        title: 'Não foi possível carregar o usuário.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    setLoading(false);
  }, [id, reset]);

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
        await AdminUser.updateItem(id, data);
        toast({
          title: 'Usuário alterado',
          status: 'success',
          isClosable: true,
        });
        setTimeout(() => {
          onClose();
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
    [id, onClose, reset]
  );

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await AdminUser.deleteItem(id);
      toast({
        title: 'Usuário excluído',
        status: 'success',
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Não foi possível excluir o usuário.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    setLoading(false);
  }, [id, onClose]);

  useEffect(() => {
    if (id > 0) {
      handleConstruct();
    }
  }, [handleConstruct]);

  return (
    <Modal
      title="Editar"
      isOpen={isOpen}
      onClose={onClose}
      loading={loading}
      isSubmitting={isSubmitting}
      footer={
        <ButtonGroup spacing="4">
          <Button type="submit" form="formRef" isLoading={isSubmitting}>
            Salvar
          </Button>
          <Button colorScheme="grayBlue" variant="ghost" onClick={onClose}>
            Fechar
          </Button>
          <Button colorScheme="red" onClick={handleDelete}>
            Excluir
          </Button>
        </ButtonGroup>
      }
    >
      <VStack as="form" id="formRef" onSubmit={handleSubmit(handleOnSubmit)} spacing="4">
        <Input name="name" label="Nome" errors={errors} register={register} />
        <Input name="email" label="E-mail" errors={errors} register={register} />
        <Input name="password" type="password" label="Senha" errors={errors} register={register} />
        <Radio
          name="systemRole"
          label="Tipo de usuário"
          columns={[2]}
          getValues={getValues}
          defaultValue="ECONFORM"
          options={[
            { label: 'eConform', value: 'ECONFORM' },
            { label: 'Parceiro', value: 'PARTNER' },
          ]}
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
      </VStack>
    </Modal>
  );
};
