import React, { useCallback, useEffect, useState } from 'react';
import { ClientUser } from 'services';
import { ClientCompany } from 'services';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useToast, Button, ButtonGroup, VStack } from '@chakra-ui/react';

import Modal from 'components/Modal';
import { Input } from 'components/Forms/Input';
import { Radio } from 'components/Forms/Radio';
import { Checkbox } from 'components/Forms/Checkbox';
import { Select } from 'components/Forms/Select';
import { useAuth } from 'context/auth';

const schema = Yup.object({
  name: Yup.string().required('Nome obrigatório').min(2, 'Mínimo de 2 caracteres').max(255, 'Máximo de 255 caracteres'),
  email: Yup.string().required('Email obrigatório').email('Email inválido'),
  systemRole: Yup.string().required('Tipo de usuário obrigatório'),
});

export default ({ id, isOpen = false, onClose = () => {} }) => {
  const toast = useToast();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selecteds, setSelecteds] = useState([]);
  const [permissionView, setPermissionView] = useState(true);
  const [systemRoleView, setSystemRoleView] = useState(true);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

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

  const handleConstruct = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await ClientUser.readItem(id);
      reset({
        ...data,
        password: '',
        companies:
          data.companies[0].id === null
            ? []
            : data.companies?.map((company, i) => ({ value: company.id, label: company.name })),
      });
      setSelecteds(
        data.companies[0].id === null
          ? []
          : data.companies?.map((company, i) => ({ value: company.id, label: company.name }))
      );
      setPermissionView(data.systemRole !== 'ADMIN' && auth.email !== data.email);
      setSystemRoleView(auth.email !== data.email);
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
  }, [id, auth, reset]);

  const handleOnSubmit = useCallback(
    async (data) => {
      data.password == '' && data.systemRole === 'ADMIN'
        ? (data = {
            name: data.name,
            email: data.email,
            systemRole: data.systemRole,
            companies: data.companies?.map((company, i) => ({ id: company.value, name: company.label })) || [],
            enabled: data.enabled,
          })
        : data.password == '' && data.systemRole === 'USER'
        ? (data = {
            name: data.name,
            email: data.email,
            systemRole: data.systemRole,
            permissionRole: data.permissionRole,
            companies: data.companies?.map((company, i) => ({ id: company.value, name: company.label })) || [],
            enabled: data.enabled,
          })
        : data.systemRole === 'ADMIN'
        ? (data = {
            name: data.name,
            email: data.email,
            password: data.password,
            systemRole: data.systemRole,
            companies: data.companies?.map((company, i) => ({ id: company.value, name: company.label })) || [],
            enabled: data.enabled,
          })
        : (data = {
            ...data,
            companies: data.companies?.map((company, i) => ({ id: company.value, name: company.label })) || [],
          });
      try {
        await ClientUser.updateItem(id, data);
        reset();
        onClose();
        toast({
          title: 'Usuário alterado',
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
    [id, selecteds, onClose, reset]
  );

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await ClientUser.deleteItem(id);
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
    handleOptions();
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
          <Button type="submit" form={`formRef${id}`} isLoading={isSubmitting}>
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
      <VStack as="form" id={`formRef${id}`} onSubmit={handleSubmit(handleOnSubmit)} spacing="4">
        <Input name="name" label="Nome" errors={errors} register={register} />
        <Input name="email" label="Email" errors={errors} register={register} />
        <Input name="password" type="password" label="Senha" errors={errors} register={register} />

        {systemRoleView && (
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
        )}

        {permissionView && (
          <Checkbox
            name="permissionRole"
            label="Permissões"
            columns={[2]}
            getValues={getValues}
            options={[
              { label: 'Usuários / Criar', value: 'CREATE_USER' },
              { label: 'Usuários / Alterar', value: 'UPDATE_USER' },
              { label: 'Usuários / Excluir', value: 'DELETE_USER' },
              { label: 'Usuários / Exibir', value: 'GET_USER' },
              { label: 'Empresas / Criar', value: 'CREATE_COMPANY' },
              { label: 'Empresas / Alterar', value: 'UPDATE_COMPANY' },
              { label: 'Empresas / Excluir', value: 'DELETE_COMPANY' },
              { label: 'Empresas / Exibir', value: 'GET_COMPANY' },
              { label: 'CNPJs / Criar', value: 'CREATE_CNPJ' },
              { label: 'CNPJs / Alterar', value: 'UPDATE_CNPJ' },
              { label: 'CNPJs / Excluir', value: 'DELETE_CNPJ' },
              { label: 'CNPJs / Exibir', value: 'GET_CNPJ' },
              { label: 'Licenças / Criar', value: 'CREATE_LICENSES' },
              { label: 'Licenças / Alterar', value: 'UPDATE_LICENSES' },
              { label: 'Licenças / Excluir', value: 'DELETE_LICENSES' },
              { label: 'Licenças / Exibir', value: 'GET_LICENSES' },
              { label: 'Documentos / Criar', value: 'CREATE_FILES' },
              { label: 'Documentos / Alterar', value: 'UPDATE_FILES' },
              { label: 'Documentos / Excluir', value: 'DELETE_FILES' },
              { label: 'Documentos / Exibir', value: 'GET_FILES' },
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
          getValues={getValues}
          options={[{ label: 'Ativo', value: '1' }]}
          register={register}
          errors={errors}
        />
      </VStack>
    </Modal>
  );
};
