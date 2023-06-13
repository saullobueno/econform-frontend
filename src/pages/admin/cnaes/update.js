import React, { useCallback, useEffect, useState } from 'react';
import { AdminCnae } from 'services';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useToast, Button, ButtonGroup, VStack, Center, Icon, Badge } from '@chakra-ui/react';

import Modal from 'components/Modal';
import { Input } from 'components/Forms/Input';
import { Textarea } from 'components/Forms/Textarea';
import { Checkbox } from 'components/Forms/Checkbox';
import { Radio } from 'components/Forms/Radio';

const schema = Yup.object({
  codeClass: Yup.string().required('Código obrigatório'),
  registrationLevel: Yup.string().required('Risco obrigatório'),
  codeDescription: Yup.string()
    .required('Descrição obrigatória')
    .min(2, 'Mínimo de 2 caracteres')
    .max(255, 'Máximo de 255 caracteres'),
});

export default ({ id, isOpen = false, onClose = () => {} }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const handleConstruct = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await AdminCnae.readItem(id);
      reset(data);
      console.log('DATA-CNAE: ', data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar o CNAE.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    setLoading(false);
  }, [id, onClose, reset]);

  const handleOnSubmit = useCallback(
    async (data) => {
      try {
        await AdminCnae.updateItem(id, data);
        toast({
          title: 'CNAE alterado',
          status: 'success',
          isClosable: true,
        });
        setTimeout(() => {
          onClose();
          reset();
        }, 1000);
      } catch (error) {
        toast({
          title: 'Não foi possível alterar o CNAE.',
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
      await AdminCnae.deleteItem(id);
      toast({
        title: 'CNAE excluído',
        status: 'success',
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Não foi possível excluir este CNAE.',
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
        <Input name="codeClass" label="Código" mask="9999-9/99" errors={errors} register={register} />
        <Radio
          name="registrationLevel"
          label="Risco"
          columns={[3]}
          getValues={getValues}
          options={[
            { label: <Badge colorScheme="green">Baixo</Badge>, value: 'low_level' },
            { label: <Badge colorScheme="yellow">Médio</Badge>, value: 'medium_level' },
            { label: <Badge colorScheme="red">Alto</Badge>, value: 'high_level' },
          ]}
          register={register}
          errors={errors}
        />
        <Textarea name="codeDescription" label="Descrição" errors={errors} register={register} />
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
