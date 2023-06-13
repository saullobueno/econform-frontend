import React, { useState, useCallback, useEffect } from 'react';
import { AdminClient } from 'services';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useToast, Button, ButtonGroup, VStack, Center, Icon } from '@chakra-ui/react';

import { Loading } from 'components/Loading';
import Modal from 'components/Modal';
import { Input } from 'components/Forms/Input';
import { Checkbox } from 'components/Forms/Checkbox';

const schema = Yup.object({
  name: Yup.string().required('Nome obrigatório').min(2, 'Mínimo de 2 caracteres').max(255, 'Máximo de 255 caracteres'),
});

export default ({ id, isOpen = false, onClose = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
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
      const { data } = await AdminClient.readItem(id);
      reset(data);
    } catch (error) {
      toast({
        title: 'Não foi possível carregar o cliente.',
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
      setLoading(true);
      try {
        await AdminClient.updateItem(id, data);
        toast({
          title: 'Cliente alterado',
          status: 'success',
          isClosable: true,
        });
        setTimeout(() => {
          onClose();
          reset();
        }, 1000);
      } catch (error) {
        toast({
          title: 'Não foi possível alterar o cliente.',
          description: error.response.data.message
            ? error.response.data.message
            : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
          status: 'error',
          isClosable: true,
        });
      }
      setLoading(false);
    },
    [id, onClose]
  );

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await AdminClient.deleteItem(id);
      toast({
        title: 'Cliente excluído',
        status: 'success',
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Não foi possível excluir este cliente.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    setLoading(false);
  }, [onClose]);

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
