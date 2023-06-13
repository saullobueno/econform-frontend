import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ClientCompany } from 'services';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link as LinkRouterDom, useNavigate } from 'react-router-dom';

import {
  chakra,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Stack,
  Text,
  useToast,
  VStack,
  Flex,
  Spacer,
  Icon,
} from '@chakra-ui/react';

import { Loading } from 'components/Loading';
import { Content, Paper } from 'components/Content';

import { RiArrowRightLine } from 'react-icons/ri';
import { MdSignalCellular1Bar, MdSignalCellular3Bar, MdSignalCellular4Bar } from 'react-icons/md';
import { Input } from 'components/Forms/Input';
import { useForm } from 'react-hook-form';

const schema = Yup.object({
  cnpj: Yup.string().required('CNPJ é obrigatório.'),
});

export default () => {
  let { id: companyId } = useParams();
  let navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await ClientCompany.readItem(companyId);
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
  }, [companyId]);

  const handleOnSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        let formattedCnpj = data.cnpj?.match(/\d/g).join('');
        const dataObj = {
          cnpj: formattedCnpj,
        };
        await ClientCompany.cnpjCreateItem(companyId, dataObj);
        toast({
          title: 'CNPJ adicionado',
          status: 'success',
          isClosable: true,
        });
        fetchCompany(companyId);
        setTimeout(() => {
          reset();
        }, 1000);
      } catch (error) {
        toast({
          title: 'Não foi possível adicionar CNPJ.',
          description: error.response.data.message
            ? error.response.data.message
            : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
          status: 'error',
          isClosable: true,
        });
      }
      setLoading(false);
    },
    [companyId]
  );

  useEffect(() => {
    if (companyId > 0) {
      fetchCompany(companyId);
    }
  }, [fetchCompany]);

  return (
    <>
      <HStack bgColor="white" justify="center" align="center" mb="8" p="8" spacing="2">
        <Heading size="lg" fontWeight="semibold" textTransform="capitalize" color="grayBlue.500">
          {company.name}
        </Heading>
      </HStack>

      <Content>
        <Paper
          title="Enquadramento do CNPJ"
          justify="center"
          loading={loading}
          isSubmitting={isSubmitting}
          sizeTitle="md"
          fluid
        >
          <Center h="100%">
            <Stack spacing="16" align="center">
              {company.cnaes?.lowLevel.length <= 0 &&
                company.cnaes?.mediumLevel.length <= 0 &&
                company.cnaes?.highLevel.length <= 0 && (
                  <Stack spacing="4">
                    <Box textAlign="center">
                      <Text fontWeight="semibold" color="grayBlue.700">
                        Não foram encontradas licenças para este CNPJ.
                      </Text>
                      <Text fontSize="sm">Mas vc pode entrar no painel para ver maiores detalhes sobre a mesma.</Text>
                    </Box>

                    <Button
                      rightIcon={<RiArrowRightLine />}
                      as={LinkRouterDom}
                      to={`/client/companies/${company.id}/panel`}
                    >
                      Ver demais dados
                    </Button>
                    {/* <VStack
                          as="form"
                          id="formRef"
                          onSubmit={handleSubmit(handleOnSubmit)}
                          spacing="4"
                          align="strecth"
                        >
                          <Input
                            name="cnpj"
                            label="CNPJ"
                            mask="99.999.999/9999-99"
                            errors={errors}
                            register={register}
                          />
                          <Button type="submit" form="formRef" isLoading={isSubmitting}>
                            Adicionar
                          </Button>
                        </VStack> */}
                  </Stack>
                )}

              <Stack direction={{ base: 'column', xl: 'row' }} spacing="8">
                <Flex
                  flexDirection="column"
                  p="8"
                  maxW="320px"
                  borderRadius="3px"
                  bgColor={company.cnaes?.lowLevel.length > 0 ? 'green.500' : 'green.200'}
                  color="white"
                >
                  <Heading as="h4" size="md" display="flex" alignItems="flex-end">
                    <Icon as={MdSignalCellular1Bar} w="12" h="12" me="4" /> Risco Baixo
                  </Heading>
                  <Text py="4">
                    Atividades realizadas no início do funcionamento da empresa que ocorrerão sem vistoria prévia e sem
                    emissão de licenciamento,{' '}
                    <chakra.strong>ficando sujeito a vistoria da fiscalização posterior.</chakra.strong>
                  </Text>
                  <Spacer />
                  <Button
                    rightIcon={company.cnaes?.lowLevel.length > 0 ? <RiArrowRightLine /> : null}
                    as={LinkRouterDom}
                    to={
                      company.cnaes?.lowLevel.length > 0
                        ? `/client/companies/${company.id}/panel?cnae_level="low_level"`
                        : '#'
                    }
                    isDisabled={!company.cnaes?.lowLevel.length > 0}
                  >
                    {company.cnaes?.lowLevel.length > 0 ? 'Ver' : 'Não possui'}
                  </Button>
                </Flex>

                <Flex
                  flexDirection="column"
                  p="8"
                  maxW="320px"
                  borderRadius="3px"
                  bgColor={company.cnaes?.mediumLevel.length > 0 ? 'yellow.500' : 'yellow.200'}
                  color="white"
                >
                  <Heading as="h4" size="md" display="flex" alignItems="flex-end">
                    <Icon as={MdSignalCellular3Bar} w="12" h="12" me="4" /> Risco Médio
                  </Heading>
                  <Text py="4">
                    Atividades que podem ser vistoriadas posteriormente, permitindo o funcionamento contínuo e regular,{' '}
                    <chakra.strong>sendo emitido licenciamento provisório para essas atividades.</chakra.strong>
                  </Text>
                  <Spacer />
                  <Button
                    rightIcon={company.cnaes?.mediumLevel.length > 0 ? <RiArrowRightLine /> : null}
                    as={LinkRouterDom}
                    to={
                      company.cnaes?.mediumLevel.length > 0
                        ? `/client/companies/${company.id}/panel?cnae_level="medium_level"`
                        : '#'
                    }
                    isDisabled={!company.cnaes?.mediumLevel.length > 0}
                  >
                    {company.cnaes?.mediumLevel.length > 0 ? 'Ver' : 'Não possui'}
                  </Button>
                </Flex>

                <Flex
                  flexDirection="column"
                  p="8"
                  maxW="320px"
                  borderRadius="3px"
                  bgColor={company.cnaes?.highLevel.length > 0 ? 'red.500' : 'red.200'}
                  color="white"
                >
                  <Heading as="h4" size="md" display="flex" alignItems="flex-end">
                    <Icon as={MdSignalCellular4Bar} w="12" h="12" me="4" /> Risco Alto
                  </Heading>
                  <Text py="4">
                    As atividades econômicas que exigem vistoria prévia e licenciamento sanitário antes do início do
                    funcionamento da empresa.
                  </Text>
                  <Spacer />
                  <Button
                    rightIcon={company.cnaes?.highLevel.length > 0 ? <RiArrowRightLine /> : null}
                    as={LinkRouterDom}
                    to={
                      company.cnaes?.highLevel.length > 0
                        ? `/client/companies/${company.id}/panel?cnae_level="high_level"`
                        : '#'
                    }
                    isDisabled={!company.cnaes?.highLevel.length > 0}
                  >
                    {company.cnaes?.highLevel.length > 0 ? 'Ver' : 'Não possui'}
                  </Button>
                </Flex>
              </Stack>
              <Box w={{ base: '100%', xl: '50%' }}>
                <Text fontSize="xs" color="grayBlue.600" textAlign="center">
                  <b>GRAU DE RISCO</b> – Nível de perigo potencial de ocorrência de danos à integridade física e à saúde
                  humana, ao meio ambiente em decorrência de exercício das atividades.
                </Text>
              </Box>
            </Stack>
          </Center>
        </Paper>
      </Content>
    </>
  );
};
