import React, { useCallback, useEffect, useState } from 'react';
import { ClientCompany, ClientUser } from 'services';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useToast, Button, ButtonGroup, VStack } from '@chakra-ui/react';

import Modal from 'components/Modal';
import { Input } from 'components/Forms/Input';
import { Radio } from 'components/Forms/Radio';
import { Checkbox } from 'components/Forms/Checkbox';
import { Select } from 'components/Forms/Select';

const schema = Yup.object({
  name: Yup.string().required('Nome obrigatório').min(2, 'Mínimo de 2 caracteres').max(255, 'Máximo de 255 caracteres'),
  email: Yup.string().required('Email obrigatório').email('Email inválido'),
  password: Yup.string()
    .required('Senha obrigatória')
    .min(6, 'Mínimo de 6 caracteres')
    .max(32, 'Máximo de 32 caracteres'),
  systemRole: Yup.string().required('Tipo de usuário obrigatório'),
});

export default ({ isOpen = false, onClose = () => {} }) => {
  const toast = useToast();
  const [options, setOptions] = useState([]);
  const [selecteds, setSelecteds] = useState([]);
  const [permissionView, setPermissionView] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOptions = useCallback(async () => {
    let { data } = await ClientCompany.index(`&page=&limit=9999999`);
    let companies = data.items
      ?.filter((company) => company.enabled == 1)
      .map((company) => ({
        value: company.id,
        label: company.name,
      }));
    setOptions(companies);
  }, []);

  const handleOnSubmit = useCallback(
    async (data) => {
      try {
        await ClientUser.createItem({
          ...data,
          companies: data.companies?.map((item) => ({ id: Number(item.value) })),
        });
        reset();
        onClose();
        toast({
          title: 'Usuário criado',
          status: 'success',
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Não foi possível criar o usuário.',
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

  useEffect(() => {
    handleOptions();
  }, []);

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
        <Input name="email" label="Email" errors={errors} register={register} />
        <Input name="password" type="password" label="Senha" errors={errors} register={register} />
        <Radio
          name="systemRole"
          label="Tipo de usuário"
          columns={[2]}
          getValues={getValues}
          defaultValue="ADMIN"
          options={[
            { label: 'Administrador', value: 'ADMIN', onClick: () => setPermissionView(false) },
            { label: 'Usuário', value: 'USER', onClick: () => setPermissionView(true) },
          ]}
          register={register}
          errors={errors}
        />

        {permissionView && (
          <Checkbox
            name="permissionRole"
            label="Permissões"
            columns={[2]}
            defaultValue={[
              'CREATE_USER',
              'UPDATE_USER',
              'DELETE_USER',
              'GET_USER',
              'CREATE_COMPANY',
              'UPDATE_COMPANY',
              'DELETE_COMPANY',
              'GET_COMPANY',
              'CREATE_CNPJ',
              'UPDATE_CNPJ',
              'DELETE_CNPJ',
              'GET_CNPJ',
              'CREATE_LICENSES',
              'UPDATE_LICENSES',
              'DELETE_LICENSES',
              'GET_LICENSES',
              'CREATE_FILES',
              'UPDATE_FILES',
              'DELETE_FILES',
              'GET_FILES',
            ]}
            options={[
              { label: 'Usuários / Criar', value: 'CREATE_USER', defaultChecked: true },
              { label: 'Usuários / Alterar', value: 'UPDATE_USER', defaultChecked: true },
              { label: 'Usuários / Excluir', value: 'DELETE_USER', defaultChecked: true },
              { label: 'Usuários / Exibir', value: 'GET_USER', defaultChecked: true },
              { label: 'Empresas / Criar', value: 'CREATE_COMPANY', defaultChecked: true },
              { label: 'Empresas / Alterar', value: 'UPDATE_COMPANY', defaultChecked: true },
              { label: 'Empresas / Excluir', value: 'DELETE_COMPANY', defaultChecked: true },
              { label: 'Empresas / Exibir', value: 'GET_COMPANY', defaultChecked: true },
              { label: 'CNPJs / Criar', value: 'CREATE_CNPJ', defaultChecked: true },
              { label: 'CNPJs / Alterar', value: 'UPDATE_CNPJ', defaultChecked: true },
              { label: 'CNPJs / Excluir', value: 'DELETE_CNPJ', defaultChecked: true },
              { label: 'CNPJs / Exibir', value: 'GET_CNPJ', defaultChecked: true },
              { label: 'Licenças / Criar', value: 'CREATE_LICENSES', defaultChecked: true },
              { label: 'Licenças / Alterar', value: 'UPDATE_LICENSES', defaultChecked: true },
              { label: 'Licenças / Excluir', value: 'DELETE_LICENSES', defaultChecked: true },
              { label: 'Licenças / Exibir', value: 'GET_LICENSES', defaultChecked: true },
              { label: 'Documentos / Criar', value: 'CREATE_FILES', defaultChecked: true },
              { label: 'Documentos / Alterar', value: 'UPDATE_FILES', defaultChecked: true },
              { label: 'Documentos / Excluir', value: 'DELETE_FILES', defaultChecked: true },
              { label: 'Documentos / Exibir', value: 'GET_FILES', defaultChecked: true },
            ]}
            register={register}
            errors={errors}
          />
        )}

        <Select
          name="companies"
          label="Empresas"
          selectAllOption
          control={control}
          options={options}
          isMulti
          onChange={(value) => {
            setValue('companies', value);
            setSelecteds(value);
          }}
          value={selecteds}
          errors={errors}
        />
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
