import React, { useCallback } from 'react';
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
  codeDescription: Yup.string()
    .required('Descrição obrigatória')
    .min(2, 'Mínimo de 2 caracteres')
    .max(255, 'Máximo de 255 caracteres'),
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
        await AdminCnae.createItem(data);
        toast({
          title: 'CNAE criado',
          status: 'success',
          isClosable: true,
        });
        setTimeout(() => {
          onClose();
          reset();
        }, 1000);
      } catch (error) {
        toast({
          title: 'Não foi possível criar o CNAE.',
          description: error.response.data.message
            ? error.response.data.message
            : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
          status: 'error',
          isClosable: true,
        });
      }
    },
    [onClose, reset]
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
        <Input name="codeClass" label="Código" mask="9999-9/99" errors={errors} register={register} />
        <Radio
          name="registrationLevel"
          label="Risco"
          columns={[3]}
          defaultValue="low_level"
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
          options={[{ label: 'Ativo', value: 1, defaultChecked: true }]}
          register={register}
          errors={errors}
        />
      </VStack>
    </Modal>
  );
};
