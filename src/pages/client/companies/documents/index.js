import React, { useEffect, useState, useCallback } from 'react';
import nprogress from 'nprogress';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { ClientCompany } from 'services';

import ButtonSearch from 'components/ButtonSearch';
import Breadcrumbs from 'components/Breadcrumbs';
import { Content, Paper } from 'components/Content';
import Pagination from 'components/Pagination';
import Result from 'components/Result';
import ShowingItemsLegend from 'components/Tables/ShowingItemsLegend';
import ItemsPerPage from 'components/Tables/ItemsPerPage';

import { useToast, Box, Icon, Text, HStack, Stack, SimpleGrid, VStack } from '@chakra-ui/react';

import { FiImage, FiFile } from 'react-icons/fi';
import { FcFolder, FcOpenedFolder } from 'react-icons/fc';
import { ImBlocked } from 'react-icons/im';
import { BsInboxFill } from 'react-icons/bs';

import {
  GrDocumentPdf,
  GrDocumentZip,
  GrDocumentTxt,
  GrDocumentWord,
  GrDocumentCsv,
  GrDocumentExcel,
  GrDocumentPpt,
  GrDocumentVideo,
  GrDocumentSound,
  GrDocumentRtf,
} from 'react-icons/gr';

import { useDelayedValue } from 'hooks/useDelayedValue';
import { useCan } from 'hooks/useCan';
import { date } from 'utils/format';

export default function ClientCompaniesLicensesPage() {
  let { id: companyId } = useParams();
  let { search: argsLocation } = useLocation();
  const [searchParams] = useSearchParams();
  const [cnaeLevel, setCnaeLevel] = useState(searchParams.get('cnae_level'));
  let { clientNationalRegistrationId } = useParams();
  let { clientNationalRegistrationFiscalRegistrationId } = useParams();
  const toast = useToast();
  const [data, setData] = useState([]);
  const [cnpj, setCnpj] = useState(clientNationalRegistrationId || '');
  const [cnae, setCnae] = useState(clientNationalRegistrationFiscalRegistrationId || '');
  const [cnpjName, setCnpjName] = useState('');
  const [cnaeName, setCnaeName] = useState(searchParams.get('cnae') || '');
  const [loading, setLoading] = useState(true);
  const getFilesCan = useCan({ permission_role: ['GET_FILES'] });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pagesInRange, setPagesInRange] = useState([]);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState('et.id');
  const [direction, setDirection] = useState('desc');

  const searchDelayed = useDelayedValue(search, 1000);

  const fetchCnpj = useCallback(async () => {
    try {
      if (clientNationalRegistrationId) {
        const { data } = await ClientCompany.cnpjIndex(companyId, `?search=${clientNationalRegistrationId}`);
        setCnpjName(data.items[0].registrationName || '');
      }
    } catch (error) {}
  }, [clientNationalRegistrationId]);

  const fetchData = useCallback(
    async (page) => {
      setLoading(true);
      nprogress.start();
      setPage(page);
      try {
        const { data } = await ClientCompany.fileIndex(
          companyId,
          cnpj,
          cnae,
          `${
            argsLocation ? '&' + argsLocation.slice(1) : ''
          }&search=${searchDelayed}&page=${page}&limit=${limit}&sort=${sort}&direction=${direction}`
        );
        setData(data?.items);
        setTotal(Number(data.items?.length) || 0);
        setPagesInRange(data?.page_in_range);
        if (searchParams.get('cnae')) {
          setCnaeName(searchParams.get('cnae') || '');
        }
      } catch (error) {
        toast({
          title: 'Não foi possível carregar os documentos.',
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
    [window, companyId, cnpj, cnae, cnaeName, argsLocation, searchDelayed, page, limit, sort, direction]
  );

  const handleSort = (item, direction) => {
    setSort(item.id);
    setDirection(direction);
    fetchData(page);
  };

  const handlePageChange = (page) => {
    setPage(page - 1);
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

  const handlePerRowsChange = (newLimit) => {
    setLoading(true);
    setLimit(newLimit);
    setLoading(false);
  };

  useEffect(() => {
    if (companyId > 0) {
      fetchCnpj();
      fetchData(page);
    }
  }, [cnaeLevel, cnpj, cnae, searchDelayed, page, limit, sort, direction]);

  return (
    <Content>
      <Paper title="Documentos" fluid loading={loading} sizeTitle="md">
        {getFilesCan ? (
          total > 0 && !loading ? (
            <>
              <Stack direction={{ base: 'column', md: 'row' }} mb="8" justify="space-between">
                <Stack direction={{ base: 'column', md: 'row' }} spacing="8" align="center">
                  <ButtonSearch
                    loading={loading}
                    valueSearch={search}
                    total={total > 0}
                    handleSearch={handleSearch}
                    handleClearSearch={handleClearSearch}
                    fetchData={() => fetchData(0)}
                  />
                  <Breadcrumbs
                    title={
                      cnpjName && !cnaeName ? (
                        <>
                          <Icon as={FcOpenedFolder} boxSize="1rem" mr="1" textTransform="capitalize" />{' '}
                          {typeof cnpjName === 'string' ? cnpjName.toLowerCase() : cnpjName}
                        </>
                      ) : cnpjName && cnaeName ? (
                        <>
                          <Icon as={FcOpenedFolder} boxSize="1rem" mr="1" textTransform="capitalize" />{' '}
                          {typeof cnaeName === 'string' ? cnaeName.toLowerCase() : cnaeName}
                        </>
                      ) : (
                        ''
                      )
                    }
                    pages={[
                      {
                        page: 'Início',
                        link: `/client/companies/${companyId}/documents?cnae_level=${cnaeLevel}`,
                        onclick: () => {
                          setCnpj(''), setCnae(''), setCnpjName(''), setCnaeName('');
                        },
                      },
                      {
                        page:
                          cnpjName && cnaeName ? (
                            <>
                              <Icon as={FcOpenedFolder} boxSize="1rem" mr="1" textTransform="capitalize" />{' '}
                              {typeof cnpjName === 'string' ? cnpjName.toLowerCase() : cnpjName}
                            </>
                          ) : null,
                        link: `/client/companies/${companyId}/documents/${cnpj}?cnae_level=${cnaeLevel}`,
                        onclick: () => {
                          setCnae(''), setCnaeName('');
                        },
                      },
                    ]}
                    h="auto"
                  />
                </Stack>
                <Stack direction={{ base: 'column', md: 'row' }} spacing="8" align="center">
                  <ShowingItemsLegend total={total} limit={limit} page={page} />
                  <ItemsPerPage total={total} limit={limit} handlePerRowsChange={handlePerRowsChange} />
                </Stack>
              </Stack>
              <SimpleGrid columns={[1, 1, 2, 2, 2, 3, 4, 4, 5, 6]} spacing="4">
                {data?.map((doc) => (
                  <HStack
                    key={doc.id}
                    borderRadius="3px"
                    p="4"
                    cursor="pointer"
                    _hover={{ backgroundColor: 'grayBlue.100' }}
                    title={doc.name}
                    align="center"
                    onClick={() => {
                      if (doc.type !== 'folder') {
                        return window.open(doc.href, '_blank');
                      } else if (!cnpj) {
                        setCnpj(doc.id);
                        setCnpjName(doc.type === 'folder' && doc.name.length > 9 ? doc.name.slice(20) : doc.name);
                      } else {
                        setCnae(doc.id);
                        setCnaeName(doc.name);
                      }
                    }}
                  >
                    <Box mr="4" align="center">
                      {doc.type === 'folder' ? (
                        <Icon as={FcFolder} boxSize="2rem" />
                      ) : doc.type === 'jpg' ||
                        doc.type === 'jpeg' ||
                        doc.type === 'png' ||
                        doc.type === 'gif' ||
                        doc.type === 'bmp' ||
                        doc.type === 'tiff' ||
                        doc.type === 'cdr' ||
                        doc.type === 'ai' ? (
                        <Icon as={FiImage} boxSize="2rem" color="orange.400" />
                      ) : doc.type === 'pdf' ? (
                        <Icon as={GrDocumentPdf} boxSize="2rem" color="red.400" sx={{ path: { stroke: 'red.500' } }} />
                      ) : doc.type === 'zip' ? (
                        <Icon
                          as={GrDocumentZip}
                          boxSize="2rem"
                          color="green.500"
                          sx={{ path: { stroke: 'green.400' } }}
                        />
                      ) : doc.type === 'csv' ? (
                        <Icon
                          as={GrDocumentCsv}
                          boxSize="2rem"
                          color="cyan.400"
                          sx={{ path: { stroke: 'cyan.400' } }}
                        />
                      ) : doc.type === 'rtf' ? (
                        <Icon
                          as={GrDocumentRtf}
                          boxSize="2rem"
                          color="cyan.400"
                          sx={{ path: { stroke: 'cyan.400' } }}
                        />
                      ) : doc.type === 'doc' || doc.type === 'docx' ? (
                        <Icon
                          as={GrDocumentWord}
                          boxSize="2rem"
                          color="blue.400"
                          sx={{ path: { stroke: 'blue.400' } }}
                        />
                      ) : doc.type === 'xls' || doc.type === 'xlsx' ? (
                        <Icon
                          as={GrDocumentExcel}
                          boxSize="2rem"
                          color="green.500"
                          sx={{ path: { stroke: 'green.400' } }}
                        />
                      ) : doc.type === 'ppt' || doc.type === 'pptx' ? (
                        <Icon
                          as={GrDocumentPpt}
                          boxSize="2rem"
                          color="pink.400"
                          sx={{ path: { stroke: 'pink.400' } }}
                        />
                      ) : doc.type === 'mp4' ||
                        doc.type === 'mpeg' ||
                        doc.type === 'avi' ||
                        doc.type === 'mpg' ||
                        doc.type === 'mpg' ||
                        doc.type === 'mov' ? (
                        <Icon
                          as={GrDocumentVideo}
                          boxSize="2rem"
                          color="purple.400"
                          sx={{ path: { stroke: 'purple.400' } }}
                        />
                      ) : doc.type === 'mp3' || doc.type === 'wav' || doc.type === 'ogg' || doc.type === 'wma' ? (
                        <Icon
                          as={GrDocumentSound}
                          boxSize="2rem"
                          color="orange.400"
                          sx={{ path: { stroke: 'orange.400' } }}
                        />
                      ) : doc.type === 'txt' ? (
                        <Icon
                          as={GrDocumentTxt}
                          boxSize="2rem"
                          color="gray.600"
                          sx={{ path: { stroke: 'gray.600' } }}
                        />
                      ) : (
                        <Icon as={FiFile} boxSize="2rem" color="gray.400" sx={{ path: { stroke: 'gray.400' } }} />
                      )}
                    </Box>
                    <VStack spacing="0.5" align="start">
                      <Text fontSize="xs" fontWeight="semibold" noOfLines={3} textTransform="capitalize">
                        {doc.type === 'folder' && doc.name.length > 9
                          ? doc.name.slice(20).toString().toLowerCase()
                          : doc.name.toString().toLowerCase()}
                      </Text>
                      {doc.type !== 'folder' && (
                        <Text fontSize="x-small" noOfLines={1}>
                          {doc.fiscalLicenseName}
                        </Text>
                      )}
                      {doc.type !== 'folder' && (
                        <Text fontSize="x-small">Validade: {doc?.validUntil ? date(doc.validUntil?.date) : 'n/d'}</Text>
                      )}
                    </VStack>
                  </HStack>
                ))}
              </SimpleGrid>
              <Pagination page={page} handlePageChange={handlePageChange} pagesInRange={pagesInRange} />
            </>
          ) : (
            <Result
              title="Vazio"
              description="Os documentos aparecerão após um CNPJ ser adicionado ou serem feitos uploads em licenças."
              icon={BsInboxFill}
            />
          )
        ) : (
          <Result
            title="Acesso restrito"
            description="Você não tem permissão para visualizar esta listagem."
            icon={ImBlocked}
          />
        )}
      </Paper>
    </Content>
  );
}
