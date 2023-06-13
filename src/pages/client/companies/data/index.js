import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import nprogress from 'nprogress';
import { useParams, useSearchParams } from 'react-router-dom';
import { ClientCompany } from 'services';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { format } from 'date-fns';
import slugify from 'react-slugify';

import { Button, ButtonGroup, Flex, FormLabel, Image, useToast, VisuallyHidden, VStack } from '@chakra-ui/react';
import { Loading } from 'components/Loading';
import { Content, Paper } from 'components/Content';
import { Input } from 'components/Forms/Input';
import { Checkbox } from 'components/Forms/Checkbox';

import Delete from './delete';

import { useCan } from 'hooks/useCan';
import DefaultImage from 'resources/images/company-default-image.png';

const schema = Yup.object({
  name: Yup.string().required('Nome é obrigatório.'),
});

export default () => {
  let { id: companyId } = useParams();
  const [searchParams] = useSearchParams();
  const [cnaeLevel, setCnaeLevel] = useState(searchParams.get('cnae_level'));
  let navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const updateCompanyCan = useCan({ permission_role: ['UPDATE_COMPANY'] });
  const deleteCompanyCan = useCan({ permission_role: ['DELETE_COMPANY'] });
  const [company, setCompany] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const inputFileImage = useRef();
  const [deleteItem, setDeleteItem] = useState(0);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    nprogress.start();
    try {
      const { data } = await ClientCompany.readItem(companyId);
      reset(data);
      setCompany(data);
    } catch (error) {
      toast({
        title: 'Não foi possível carregar as informações da empresa.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
      setTimeout(() => {
        navigate('/client/companies', { replace: true });
      }, 2000);
    }
    setLoading(false);
    nprogress.done();
  }, [companyId]);

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  const s3 = new S3Client({
    region: process.env.REACT_APP_AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_S3_SECRET_ACCESS_KEY,
    },
  });

  const handleInsertLogo = useCallback(
    async (e) => {
      setLoading(true);
      try {
        e.preventDefault();
        company.logoSrc && handleDeleteLogo(company.logoSrc);

        let file = inputFileImage.current.files[0];
        let newFileName = inputFileImage.current.files[0].name.replace(/\s/g, '');
        const photoKey =
          process.env.REACT_APP_AWS_S3_DIR_NAME_LOGOS +
          'logo-' +
          company.id +
          '-' +
          slugify(company.name) +
          '-' +
          format(new Date(), 'yyyyMMddHHmm') +
          newFileName.slice(-4);

        ClientCompany.logoCreateItem(companyId, { file: photoKey });

        const uploadParams = {
          Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
          Key: photoKey,
          Body: file,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        toast({
          title: 'Logo cadastrada',
          status: 'success',
          isClosable: true,
        });
        setThumbnail(null);
        fetchCompany(companyId);
      } catch (error) {
        toast({
          title: 'Não foi possível enviar a imagem anexada.',
          description: error.response.data.message
            ? error.response.data.message
            : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
          status: 'error',
          isClosable: true,
        });
      }
      setLoading(false);
    },
    [thumbnail]
  );

  const handleDeleteLogo = useCallback(async (logo) => {
    setLoading(true);
    try {
      await ClientCompany.logoDeleteItem(companyId);
      const deleteParams = {
        Key: logo,
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
      };
      await s3.send(new DeleteObjectCommand(deleteParams));
      toast({
        title: 'Logo excluida',
        status: 'success',
        isClosable: true,
      });
      fetchCompany(companyId);
    } catch (error) {
      toast({
        title: 'Não foi possível excluir a logo.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    setLoading(false);
  }, []);

  const handleOnSubmit = useCallback(
    async ({ name, enabled }) => {
      try {
        await ClientCompany.updateItem(companyId, { name, enabled });
        toast({
          title: 'Empresa atualizada',
          status: 'success',
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Não foi possível alterar as informações da empresa.',
          description: error.response.data.message
            ? error.response.data.message
            : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
          status: 'error',
          isClosable: true,
        });
      }
    },
    [companyId]
  );

  useEffect(() => {
    if (companyId > 0) {
      fetchCompany(companyId);
    }
  }, [fetchCompany, cnaeLevel]);

  return (
    <>
      <Content>
        <Paper title="Imagem" loading={loading} sizeTitle="md">
          <Flex direction="column" gap="8">
            <VStack align="start">
              <FormLabel htmlFor="exampleFormControlInput0">Imagem de exibição</FormLabel>
              <Image
                src={
                  preview
                    ? preview
                    : company.logoSrc
                    ? process.env.REACT_APP_AWS_S3_DOMAIN +
                      process.env.REACT_APP_AWS_S3_BUCKET_NAME +
                      '/' +
                      company.logoSrc
                    : DefaultImage
                }
                maxW={{ base: '100%', lg: '500px' }}
                height="auto"
                border="1px solid"
                borderColor="grayBlue.200"
                borderRadius="3px"
                alt={`Logo da empresa da ${reset.name}`}
              />
              <VisuallyHidden>
                <Input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  display="none"
                  ref={inputFileImage}
                />
              </VisuallyHidden>
              <ButtonGroup variant="ghost" size="xs" spacing="4">
                <Button
                  onClick={() => {
                    inputFileImage.current.click();
                  }}
                  isDisabled={!updateCompanyCan}
                >
                  Escolher outra imagem
                </Button>
              </ButtonGroup>
            </VStack>

            <VStack ml="auto">
              <ButtonGroup spacing="4">
                {thumbnail ? (
                  <>
                    <Button onClick={handleInsertLogo} isDisabled={!updateCompanyCan}>
                      Confirmar upload
                    </Button>
                    <Button onClick={() => setThumbnail(null)} colorScheme="grayBlue" isDisabled={!updateCompanyCan}>
                      Cancelar upload
                    </Button>
                  </>
                ) : (
                  ''
                )}
                {company.logoSrc && !thumbnail && (
                  <Button
                    onClick={() => handleDeleteLogo(company.logoSrc)}
                    colorScheme="red"
                    isDisabled={!updateCompanyCan}
                  >
                    Excluir imagem
                  </Button>
                )}
              </ButtonGroup>
            </VStack>
          </Flex>
        </Paper>
        <Paper title="Dados" loading={loading} isSubmitting={isSubmitting} sizeTitle="md">
          <Flex direction="column" gap="8">
            <VStack as="form" id="formCompany" spacing="8" align="stretch" onSubmit={handleSubmit(handleOnSubmit)}>
              <Input
                name="name"
                label="Nome"
                w={{ base: '100%', lg: '50%' }}
                htmlSize={24}
                errors={errors}
                register={register}
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
            <VStack ml="auto">
              <ButtonGroup spacing="4">
                <Button type="submit" form="formCompany" isDisabled={!updateCompanyCan}>
                  Salvar
                </Button>
                <Button colorScheme="red" onClick={() => setDeleteItem(companyId)} isDisabled={!deleteCompanyCan}>
                  Excluir empresa
                </Button>
              </ButtonGroup>
            </VStack>
          </Flex>
        </Paper>
      </Content>
      <Delete
        id={deleteItem}
        isOpen={!!deleteItem}
        onClose={() => {
          setDeleteItem(0);
        }}
      />
    </>
  );
};
