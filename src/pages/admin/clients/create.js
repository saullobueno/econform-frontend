import React, { useCallback } from 'react';
import { AdminClient } from 'services';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useToast, Button, ButtonGroup, VStack } from '@chakra-ui/react';

import Modal from 'components/Modal';
import { Input } from 'components/Forms/Input';
import { Checkbox } from 'components/Forms/Checkbox';

const schema = Yup.object({
  name: Yup.string().required('Nome obrigatório').min(2, 'Mínimo de 2 caracteres').max(255, 'Máximo de 255 caracteres'),
});

export default ({ isOpen = false, onClose = () => {} }) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOnSubmit = useCallback(
    async (data) => {
      try {
        await AdminClient.createItem(data);
        toast({
          title: 'Cliente criado',
          status: 'success',
          isClosable: true,
        });
        setTimeout(() => {
          onClose();
          reset();
        }, 1000);
      } catch (error) {
        toast({
          title: 'Não foi possível criar o cliente.',
          description: error.response.data.message
            ? error.response.data.message
            : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
          status: 'error',
          isClosable: true,
        });
      }
    },
    [onClose]
  );

  return (
    <Modal
      title="Adicionar"
      isOpen={isOpen}
      onClose={onClose}
      isSubmitting={isSubmitting}
      footer={
        <ButtonGroup spacing="4">
          <Button type="submit" form="formRef" isLoading={isSubmitting}>
            Salvar
          </Button>
          <Button colorScheme="grayBlue" variant="ghost" onClick={onClose}>
            Fechar
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
          options={[{ name: 'enabled', label: 'Ativo', value: 1, defaultChecked: true }]}
          register={register}
          errors={errors}
        />
      </VStack>
    </Modal>
  );
};
