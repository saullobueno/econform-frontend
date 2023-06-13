import React, { useCallback } from 'react';
import { ClientCompany } from 'services';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useToast, Button, ButtonGroup, VStack } from '@chakra-ui/react';

import Modal from 'components/Modal';
import { Input } from 'components/Forms/Input';
import { Checkbox } from 'components/Forms/Checkbox';

const schema = Yup.object({
  cnpj: Yup.string().required('CNPJ é obrigatório.'),
});

export default ({ isOpen, onClose = () => {} }) => {
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
        let formattedCnpj = data.cnpj?.match(/\d/g).join('');
        const dataObj = {
          ...data,
          cnpj: formattedCnpj,
        };
        await ClientCompany.createItem(dataObj);
        toast({
          title: 'Empresa criada',
          status: 'success',
          isClosable: true,
        });
        setTimeout(() => {
          onClose();
          reset();
        }, 1000);
      } catch (error) {
        toast({
          title: 'Não foi possível criar a empresa.',
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
        <Input name="cnpj" label="CNPJ" mask="99.999.999/9999-99" errors={errors} register={register} />
        <Checkbox
          name="companyEnabled"
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
