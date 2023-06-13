import React, { useCallback, useEffect, useState } from 'react';
import { AdminLicense } from 'services';
import { AdminCnae } from 'services';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useToast, Button, ButtonGroup, VStack, SimpleGrid, Icon } from '@chakra-ui/react';

import Modal from 'components/Modal';
import { Input } from 'components/Forms/Input';
import { NumberInput } from 'components/Forms/NumberInput';
import { Textarea } from 'components/Forms/Textarea';
import { Checkbox } from 'components/Forms/Checkbox';
import { Select } from 'components/Forms/Select';

import {
  MdSignalCellularConnectedNoInternet0Bar,
  MdSignalCellular1Bar,
  MdSignalCellular3Bar,
  MdSignalCellular4Bar,
} from 'react-icons/md';

const schema = Yup.object({
  name: Yup.string().required('Nome obrigatório').min(2, 'Mínimo de 2 caracteres').max(255, 'Máximo de 255 caracteres'),
  description: Yup.string()
    .required('Descrição obrigatório')
    .min(2, 'Mínimo de 2 caracteres')
    .max(255, 'Máximo de 255 caracteres'),
  impact: Yup.number().required('Dado obrigatório').min(1).max(3, 'Mínimo de 1 e máximo de 3'),
  complexity: Yup.number().required('Dado obrigatório').min(1).max(3, 'Mínimo de 1 e máximo de 3'),
  estimatedEffort: Yup.number().required('Dado obrigatório').min(0).max(30, 'Máximo de 30'),
  estimatedBureaucratic: Yup.number().required('Dado obrigatório').min(0).max(365, 'Máximo de 365'),
  estimatedValid: Yup.number().required('Dado obrigatório').min(0).max(365, 'Máximo de 365'),
});

export default ({ isOpen = false, onClose = () => {} }) => {
  const toast = useToast();
  const [options, setOptions] = useState([]);
  const [selecteds, setSelecteds] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOptions = useCallback(async () => {
    let { data } = await AdminCnae.index(`&limit=500000`);
    let cnaes = data.result[0].items
      ?.filter((cnae) => cnae.enabled == 1)
      .map((cnae) => ({
        value: cnae.id,
        label: (
          <>
            {cnae.codeClass}{' '}
            <Icon
              as={
                cnae.registrationLevel === 'low_level'
                  ? MdSignalCellular1Bar
                  : cnae.registrationLevel === 'medium_level'
                  ? MdSignalCellular3Bar
                  : cnae.registrationLevel === 'high_level'
                  ? MdSignalCellular4Bar
                  : MdSignalCellularConnectedNoInternet0Bar
              }
              color={
                cnae.registrationLevel === 'low_level'
                  ? 'green.400'
                  : cnae.registrationLevel === 'medium_level'
                  ? 'yellow.400'
                  : cnae.registrationLevel === 'high_level'
                  ? 'red.400'
                  : 'grayBlue.600'
              }
              w={4}
              h={4}
              ms="2"
              title={
                cnae.registrationLevel === 'low_level'
                  ? 'Risco Baixo'
                  : cnae.registrationLevel === 'medium_level'
                  ? 'Risco Médio'
                  : cnae.registrationLevel === 'high_level'
                  ? 'Risco Alto'
                  : 'N/D'
              }
            />
          </>
        ),
        enabled: cnae.enabled,
      }));
    setOptions(cnaes);
  }, []);

  const handleOnSubmit = useCallback(
    async (data) => {
      try {
        await AdminLicense.createItem({
          ...data,
          fiscalRegistrations:
            data.fiscalRegistrations?.map((item) => ({ id: Number(item.value), name: item.label })) || [],
        });
        toast({
          title: 'Licença criada',
          status: 'success',
          isClosable: true,
        });
        setTimeout(() => {
          onClose();
          reset();
        }, 1000);
      } catch (error) {
        toast({
          title: 'Não foi possível criar a licença.',
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

  useEffect(() => {
    handleOptions();
    reset();
  }, [handleOptions, reset]);

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
        <Textarea name="description" label="Descrição" errors={errors} register={register} />
        <SimpleGrid columns={[2]} spacing="4">
          <NumberInput
            name="impact"
            label="Risco"
            defaultValue={1}
            min={1}
            max={3}
            errors={errors}
            register={register}
          />
          <NumberInput
            name="complexity"
            label="Complexidade"
            defaultValue={1}
            min={1}
            max={3}
            errors={errors}
            register={register}
          />
          <NumberInput
            name="estimatedEffort"
            label="Esforço estimado"
            min={0}
            max={30}
            errors={errors}
            register={register}
          />
          <NumberInput
            name="estimatedBureaucratic"
            label="Burocracia estimada"
            min={0}
            max={365}
            errors={errors}
            register={register}
          />
          <NumberInput
            name="estimatedValid"
            label="Validade estimada"
            min={0}
            max={365}
            errors={errors}
            register={register}
          />
        </SimpleGrid>
        <Select
          name="fiscalRegistrations"
          label="CNAEs"
          selectAllOption
          control={control}
          options={options}
          isMulti
          onChange={(value) => {
            setValue('fiscalRegistrations', value);
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
