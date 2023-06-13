import React, { useState, useEffect, useCallback } from 'react';
import nprogress from 'nprogress';
import { ClientCompany } from 'services';
import { Link as LinkRouterDom } from 'react-router-dom';

import {
  useToast,
  Button,
  ButtonGroup,
  Link,
  Text,
  Heading,
  Badge,
  Box,
  HStack,
  Image,
  SimpleGrid,
  VStack,
  Icon,
  Center,
  Select,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';

import Breadcrumbs from 'components/Breadcrumbs';
import ButtonSearch from 'components/ButtonSearch';
import { Content, Paper, Card } from 'components/Content';
import Pagination from 'components/Pagination';
import Result from 'components/Result';
import ShowingItemsLegend from 'components/Tables/ShowingItemsLegend';
import ItemsPerPage from 'components/Tables/ItemsPerPage';

import { useDelayedValue } from 'hooks/useDelayedValue';
import { useCan } from 'hooks/useCan';
import { date, daysDistance } from 'utils/format';
import { MdLocalPostOffice, MdLocalPhone, MdInbox } from 'react-icons/md';
import { ImBlocked } from 'react-icons/im';
import { BsInboxFill } from 'react-icons/bs';
import { AiOutlineFileSearch } from 'react-icons/ai';
import DefaultImage from 'resources/images/company-default-image.png';

import Create from './create';
import Delete from './delete';
import Import from './import';

import { RiAddFill, RiFileUploadLine, RiMore2Fill, RiEdit2Fill, RiDeleteBin2Fill } from 'react-icons/ri';
import {
  MdSignalCellularConnectedNoInternet0Bar,
  MdSignalCellular1Bar,
  MdSignalCellular3Bar,
  MdSignalCellular4Bar,
} from 'react-icons/md';

export default () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const createCompanyCan = useCan({ permission_role: ['CREATE_COMPANY'] });
  const getCompanyCan = useCan({ permission_role: ['GET_COMPANY'] });
  const deleteCompanyCan = useCan({ permission_role: ['DELETE_COMPANY'] });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pagesInRange, setPagesInRange] = useState([]);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState('et.id');
  const [newItem, setNewItem] = useState(false);
  const [newImportItem, setNewImportItem] = useState(false);
  const [direction, setDirection] = useState('desc');
  const [deleteItem, setDeleteItem] = useState(0);

  const searchDelayed = useDelayedValue(search, 1000);

  const fetchData = useCallback(
    async (page) => {
      setLoading(true);
      nprogress.start();
      setPage(page);
      try {
        const { data } = await ClientCompany.index(
          `&search=${searchDelayed}&page=${page}&limit=${limit}&sort=${sort}&direction=${direction}`
        );
        console.log(data);
        setData(data?.items || []);
        setTotal(Number(data.total) || 0);
        setLoading(false);
        setPagesInRange(data.pages_in_range);
      } catch (error) {
        toast({
          title: 'Não foi possível carregar as empresas.',
          description: error.response.data.message
            ? error.response.data.message
            : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
          status: 'error',
          isClosable: true,
        });
      }
      setLoading(false);
      nprogress.done();
    },
    [searchDelayed, limit, page, sort, direction]
  );

  const handlePageChange = (page) => {
    fetchData(page);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(0);
      setSearch(e.target.value);
    } else {
      setPage(0);
      setSearch(e.target.value);
    }
  };

  const handleClearSearch = () => {
    setPage(0);
    setSearch('');
  };

  const handlePerRowsChange = (e) => {
    setLimit(e.target.value);
  };

  useEffect(() => {
    fetchData(page);
  }, [searchDelayed, page, limit, sort, direction]);

  return (
    <>
      <Breadcrumbs
        title="Empresas"
        pages={[{ page: localStorage.getItem('@eConform-ClientName') || 'Início', link: '/client/dashboard' }]}
      />

      <Content>
        <Paper
          title="Empresas"
          fluid
          loading={loading}
          options={
            <ButtonGroup spacing="4">
              <Button
                type="button"
                leftIcon={<RiAddFill />}
                onClick={() => setNewItem(true)}
                isDisabled={!createCompanyCan}
              >
                Adicionar
              </Button>
              <Button
                type="button"
                variant="ghost"
                leftIcon={<RiFileUploadLine />}
                onClick={() => setNewImportItem(true)}
                isDisabled={!createCompanyCan}
              >
                Importar
              </Button>
            </ButtonGroup>
          }
        >
          {getCompanyCan ? (
            <>
              <Stack
                direction={{ base: 'column', md: 'row' }}
                mb={(total == 0 || data.length == 0) && !search && !loading ? '0' : '8'}
                justify="space-between"
              >
                <ButtonSearch
                  loading={loading}
                  valueSearch={search}
                  total={total}
                  handleSearch={handleSearch}
                  handleClearSearch={handleClearSearch}
                  fetchData={() => fetchData(0)}
                />

                <Stack direction={{ base: 'column', md: 'row' }} spacing="8" align="center">
                  <ShowingItemsLegend total={total} limit={limit} page={page} />
                  <ItemsPerPage total={total} limit={limit} handlePerRowsChange={handlePerRowsChange} />
                </Stack>
              </Stack>

              {total > 0 && !loading ? (
                <>
                  <SimpleGrid columns={[1, 1, 1, 2, 2, 3, 4, 4, 5, 6]} spacing="4">
                    {data?.map((company) => (
                      <Box
                        key={company.id}
                        bgColor="grayBlue.100"
                        borderRadius="3px"
                        _hover={{ bgColor: 'grayBlue.200', textDecoration: 'none' }}
                      >
                        <VStack
                          color="grayBlue.600"
                          fontSize="sm"
                          spacing="4"
                          p="8"
                          alignItems="left"
                          borderRadius="3px"
                          borderWidth="1px"
                          borderColor="grayBlue.100"
                        >
                          <Link as={LinkRouterDom} to={`/client/companies/${company.id}`}>
                            <Image
                              w="100%"
                              h="150px"
                              borderRadius="3px 3px 0 0"
                              objectFit="contain"
                              src={
                                company.logoSrc
                                  ? process.env.REACT_APP_AWS_S3_DOMAIN +
                                    process.env.REACT_APP_AWS_S3_BUCKET_NAME +
                                    '/' +
                                    company.logoSrc
                                  : DefaultImage
                              }
                              alt={company.name}
                            />
                          </Link>

                          <HStack align="start">
                            <Heading
                              as={LinkRouterDom}
                              to={`/client/companies/${company.id}`}
                              size="md"
                              fontWeight="semibold"
                              color={company.enabled ? 'blue.400' : 'red.500'}
                              mb="4"
                              textTransform="capitalize"
                            >
                              {company.name?.toString().toLowerCase()}
                              {!company.enabled && <Badge colorScheme="red">Inativo</Badge>}
                              {company.cnaes?.lowLevel.length <= 0 &&
                                company.cnaes?.mediumLevel.length <= 0 &&
                                company.cnaes?.highLevel.length <= 0 && (
                                  <Icon
                                    as={MdSignalCellularConnectedNoInternet0Bar}
                                    color="grayBlue.600"
                                    w={4}
                                    h={4}
                                    ms="2"
                                    title="Sem CNAEs e Licenças"
                                  />
                                )}
                              {company.cnaes?.lowLevel.length > 0 && (
                                <Icon
                                  as={MdSignalCellular1Bar}
                                  color="green.400"
                                  w={4}
                                  h={4}
                                  ms="2"
                                  title="Risco Baixo"
                                />
                              )}
                              {company.cnaes?.mediumLevel.length > 0 && (
                                <Icon
                                  as={MdSignalCellular3Bar}
                                  color="yellow.400"
                                  w={4}
                                  h={4}
                                  ms="2"
                                  title="Risco médio"
                                />
                              )}
                              {company.cnaes?.highLevel.length > 0 && (
                                <Icon as={MdSignalCellular4Bar} color="red.400" w={4} h={4} ms="2" title="Risco Alto" />
                              )}
                              {daysDistance(new Date(company.createdAt?.date), 30) && (
                                <Badge colorScheme="purple" ms="2">
                                  Novo
                                </Badge>
                              )}
                            </Heading>

                            <Box>
                              <Menu>
                                <MenuButton
                                  as={IconButton}
                                  aria-label="Options"
                                  icon={<Icon as={RiMore2Fill} w={6} h={6} />}
                                  variant="unstyle"
                                  minW="auto"
                                  color="grayBlue.400"
                                  _hover={{ color: 'blue.400' }}
                                />
                                <MenuList>
                                  <MenuItem
                                    as={LinkRouterDom}
                                    icon={<RiEdit2Fill />}
                                    to={`/client/companies/${company.id}`}
                                  >
                                    Acessar
                                  </MenuItem>
                                  <MenuItem
                                    icon={<RiDeleteBin2Fill />}
                                    onClick={() => setDeleteItem(Number(company.id))}
                                    color="red.500"
                                  >
                                    Excluir
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </Box>
                          </HStack>

                          <Text>
                            Nome fantasia:
                            <br />
                            <strong>
                              {company.registrationFantasyName == 'undefined' ||
                              company.registrationFantasyName == 'null' ||
                              company.registrationFantasyName == 'Não encontrado' ||
                              !company.registrationFantasyName
                                ? 'Não possui'
                                : company.registrationFantasyName}
                            </strong>
                          </Text>
                          <Text>
                            CNPJ:{' '}
                            <strong>{company.registrationCode ? company.registrationCode : 'Não cadastrado'}</strong>
                            <br />
                            Situação:{' '}
                            <strong>
                              {company?.registrationSituation === 'INAPTA'
                                ? 'SUSPENSA'
                                : company?.registrationSituation || 'Não cadastrado'}
                            </strong>
                            {company.registrationCreatedAt ? (
                              <>
                                {' '}
                                desde <strong>{date(company.registrationCreatedAt)}</strong>
                              </>
                            ) : (
                              ''
                            )}
                            <br />
                            Localização:{' '}
                            <strong>
                              {company.systemCityName ? company.systemCityName : 'Não cadastrado'}
                              {company.systemStateAlias ? `, ${company.systemStateAlias}` : ''}
                            </strong>
                          </Text>
                          <Text>
                            <strong>{company.totalCNPJ} CNPJs</strong> cadastrados
                            <br />
                            {/* <strong>{company.totalLicense} licenças</strong> cadastradas
                            <br /> */}
                            <strong>{company.totalFiles} documentos</strong> cadastrados
                          </Text>
                          <Text>
                            <Icon as={MdLocalPostOffice} mr="2" />
                            {company.contactEmail ? company.contactEmail : 'Email não cadastrado'}
                            <br />
                            <Icon as={MdLocalPhone} mr="2" />
                            {company.contactPhone ? company.contactPhone : 'Telefone não cadastrado'}
                          </Text>
                        </VStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                  <Pagination page={page} handlePageChange={handlePageChange} pagesInRange={pagesInRange} />
                </>
              ) : total == 0 && search && !loading ? (
                <Result
                  title={`Nada encontrado para "${search}"`}
                  description="Escolha outro termo para buscar."
                  icon={AiOutlineFileSearch}
                  options={
                    <Button type="button" variant="ghost" colorScheme="grayBlue" onClick={handleClearSearch}>
                      Voltar à lista
                    </Button>
                  }
                />
              ) : total == 0 && !loading ? (
                <Result
                  title="Vazio"
                  description="Adicione uma ou mais empresas para administrá-las posteriormente."
                  icon={BsInboxFill}
                />
              ) : null}
            </>
          ) : (
            <Result
              title="Acesso restrito"
              description="Você não tem permissão para visualizar esta listagem."
              icon={ImBlocked}
            />
          )}
        </Paper>
      </Content>

      {createCompanyCan ? (
        <Create
          isOpen={newItem}
          onClose={() => {
            setNewItem(false);
            fetchData(page);
          }}
        />
      ) : null}

      {createCompanyCan ? (
        <Import
          isOpen={newImportItem}
          onClose={() => {
            setNewImportItem(false);
            fetchData(page);
          }}
        />
      ) : null}

      {deleteCompanyCan ? (
        <Delete
          isOpen={deleteItem}
          id={deleteItem}
          onClose={() => {
            setDeleteItem(0);
            fetchData(page);
          }}
        />
      ) : null}
    </>
  );
};
