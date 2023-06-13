import React, { useState, useCallback, useEffect } from 'react';
import { ClientCompany } from 'services';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useToast, Button, ButtonGroup, VStack } from '@chakra-ui/react';

import slugify from 'react-slugify';
import Modal from 'components/Modal';
import { Input } from 'components/Forms/Input';

const schema = Yup.object({
  validUntil: Yup.string().required('Data de validade é obrigatória.'),
});

export default ({ companyId, companyName, dataItem, isOpen, onClose = () => {} }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [fileRef, setFileRef] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const handleConstruct = useCallback(async () => {
    setLoading(true);
    try {
      reset({
        fiscalLicenseName: dataItem.fiscalLicenseName,
        clientNationalRegistrationCode: dataItem.clientNationalRegistrationCode,
        fiscalRegistrationCodeClass: dataItem.fiscalRegistrationCodeClass,
      });
    } catch (error) {
      toast({
        title: 'Não foi possível carregar a licença.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    setLoading(false);
  }, [dataItem]);

  const s3 = new S3Client({
    region: process.env.REACT_APP_AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_S3_SECRET_ACCESS_KEY,
    },
  });

  const onChangeInputFile = (e) => {
    setFileRef(e.target.files[0]);
    let file = e.target.files[0].name.toLowerCase();
    let filenameSeparated = file.split('.');
    let extension = filenameSeparated.pop();
    let filename = file.replace('.' + extension, '');
    setNewFileName(slugify(filename) + '.' + extension);
  };

  const handleOnSubmit = useCallback(
    async (data) => {
      try {
        const envFolder = process.env.REACT_APP_ENVIRONMENT == 'prod' ? 'production/' : 'dev/';
        const fileKey = `${
          envFolder +
          process.env.REACT_APP_AWS_S3_DIR_NAME_DOCUMENTS +
          '/' +
          dataItem.clientNationalRegistrationCode.replace(/\s/g, '') +
          '/' +
          slugify(dataItem.fiscalRegistrationCodeClass).replace(/\D/g, '') +
          '/' +
          dataItem.fiscalLicenseId.replace(/\s/g, '') +
          '/' +
          newFileName
        }`;

        await ClientCompany.licenseCreateItem(companyId, {
          fiscalLicense: dataItem.fiscalLicenseId,
          clientNationalRegistrationId: dataItem.clientNationalRegistrationId,
          fiscalRegistrationId: dataItem.fiscalRegistrationId,
          validUntil: data.validUntil,
          file: newFileName,
        });

        const uploadParams = {
          Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: fileRef,
        };
        await s3.send(new PutObjectCommand(uploadParams));

        toast({
          title: 'Documento adicionado à licença',
          status: 'success',
          isClosable: true,
        });
        onClose();
      } catch (error) {
        toast({
          title: 'Não foi possível adicionar documento à licença.',
          description: error.response.data.message
            ? error.response.data.message
            : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
          status: 'error',
          isClosable: true,
        });
      }
    },
    [companyId, dataItem, newFileName, fileRef, s3, onClose]
  );

  useEffect(() => {
    if ((dataItem.id || 0) > 0) {
      handleConstruct();
    }
  }, [handleConstruct]);

  return (
    <Modal
      title={`Adicionar licença à ${companyName}`}
      isOpen={isOpen}
      onClose={onClose}
      loading={loading}
      isSubmitting={isSubmitting}
      footer={
        <ButtonGroup spacing="4">
          <Button type="submit" form="formRef" isLoading={isSubmitting}>
            Salvar
          </Button>
          <Button
            colorScheme="grayBlue"
            variant="ghost"
            onClick={() => {
              reset({
                fiscalLicense: null,
                validUntil: null,
                file: null,
              });
              onClose();
            }}
          >
            Fechar
          </Button>
        </ButtonGroup>
      }
    >
      <VStack as="form" id="formRef" onSubmit={handleSubmit(handleOnSubmit)} spacing="4">
        <Input
          name="fiscalLicenseName"
          label="Licença"
          errors={errors}
          variant="unstyled"
          isReadOnly
          register={register}
        />
        <Input
          name="clientNationalRegistrationCode"
          label="CNPJ relacionado"
          mask="99.999.999/9999-99"
          errors={errors}
          variant="unstyled"
          isReadOnly
          register={register}
        />
        <Input
          name="fiscalRegistrationCodeClass"
          label="CNAE relacionado"
          mask="9999-9/99"
          errors={errors}
          variant="unstyled"
          isReadOnly
          register={register}
        />
        <Input
          name="validUntil"
          type="date"
          label="Validade"
          errors={errors}
          register={register}
          helper="Se a licença for de validade indeterminada, insira a data 31/12/2099."
        />
        <Input
          name="file"
          type="file"
          label="Arquivo"
          onChange={onChangeInputFile}
          errors={errors}
          register={register}
        />
      </VStack>
    </Modal>
  );
};
