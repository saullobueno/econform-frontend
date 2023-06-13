import React, { useEffect, useState, useCallback, useMemo } from 'react';
import nprogress from 'nprogress';
import { Link as LinkRouterDom, useParams, useSearchParams } from 'react-router-dom';
import { ClientCompany } from 'services';
import { useToast, FormLabel, Badge, Icon, IconButton, Text, Stack, HStack, Link, Divider } from '@chakra-ui/react';

import Create from './create';

import { Content, Paper } from 'components/Content';
import { Select } from 'components/Forms/Select';
import Result from 'components/Result';

import { RiFileAddFill, RiFileList2Fill } from 'react-icons/ri';
import { ImBlocked } from 'react-icons/im';

import { useDelayedValue } from 'hooks/useDelayedValue';
import { date } from 'utils/format';
import { useCan } from 'hooks/useCan';
import DefaultTable from 'components/Tables/DefaultTable';

import {
  MdSignalCellular0Bar,
  MdSignalCellular1Bar,
  MdSignalCellular2Bar,
  MdSignalCellular3Bar,
  MdSignalCellular4Bar,
} from 'react-icons/md';

const signals = [
  MdSignalCellular0Bar,
  MdSignalCellular1Bar,
  // MdSignalCellular2Bar,
  MdSignalCellular3Bar,
  MdSignalCellular4Bar,
];

export default function ClientCompaniesLicensesPage() {
  let { id: companyId } = useParams();
  const [searchParams] = useSearchParams();
  const [cnaeLevel, setCnaeLevel] = useState(searchParams.get('cnae_level'));
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const createLicensesCan = useCan({ permission_role: ['CREATE_LICENSES'] });
  const getLicensesCan = useCan({ permission_role: ['GET_LICENSES'] });
  const updateLicensesCan = useCan({ permission_role: ['UPDATE_LICENSES'] });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pagesInRange, setPagesInRange] = useState([]);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState('et.id');
  const [direction, setDirection] = useState('desc');
  const [addItem, setAddItem] = useState({});
  const [company, setCompany] = useState([]);
  const [cnpjData, setCnpjData] = useState('');
  const [cnaeData, setCnaeData] = useState('');
  const [cnpjOptions, setCnpjOptions] = useState([]);
  const [cnaeOptions, setCnaeOptions] = useState([]);
  const [searchEmpty, setSearchEmpty] = useState(false);

  const searchDelayed = useDelayedValue(search, 1000);

  const fetchCompany = useCallback(async () => {
    try {
      const { data } = await ClientCompany.readItem(companyId);
      setCompany(data);

      let cnaeOptionObjLow = data.cnaes.lowLevel.map((item) => {
        return {
          value: item.id,
          label: (
            <>
              {item.code_class}
              <Icon as={MdSignalCellular1Bar} color="green.400" w={4} h={4} ms="2" title="Risco Baixo" />
            </>
          ),
        };
      });
      let cnaeOptionObjMedium = data.cnaes.mediumLevel.map((item) => {
        return {
          value: item.id,
          label: (
            <>
              {item.code_class}
              <Icon as={MdSignalCellular3Bar} color="yellow.400" w={4} h={4} ms="2" title="Risco Médio" />
            </>
          ),
        };
      });
      let cnaeOptionObjHigh = data.cnaes.highLevel.map((item) => {
        return {
          value: item.id,
          label: (
            <>
              {item.code_class}
              <Icon as={MdSignalCellular4Bar} color="red.400" w={4} h={4} ms="2" title="Risco Alto" />
            </>
          ),
        };
      });
      setCnaeOptions(
        cnaeOptions.concat(
          cnaeOptionObjLow && cnaeOptionObjLow,
          cnaeOptionObjMedium && cnaeOptionObjMedium,
          cnaeOptionObjHigh && cnaeOptionObjHigh
        )
      );
    } catch (error) {
      toast({
        title: 'Não foi possível carregar a empresa.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
  }, [companyId]);

  const fetchData = useCallback(
    async (page) => {
      setLoading(true);
      nprogress.start();
      setPage(page);
      try {
        const { data } = await ClientCompany.licenseIndex(
          companyId,
          `?cnae_level=${cnaeLevel}&search=${searchDelayed}&page=${page}&limit=${limit}&sort=${sort}&direction=${direction}&cnaes=${cnaeData}&cnpjs=${cnpjData}`
        );
        setPagesInRange(data.result[0].pages_in_range);
        setTotal(Number(data.result[0].total) || 0);

        const getData = (items) => {
          let dataFormatted = [];
          items.map((item) => {
            dataFormatted.push({
              id: item.id,
              status:
                item.status === 'in_conformity' ? (
                  <Badge colorScheme="green">Em conformidade</Badge>
                ) : item.status === 'pending' ? (
                  <Badge colorScheme="yellow">Pendente</Badge>
                ) : item.status === 'license_expired' ? (
                  <Badge colorScheme="red">Vencida</Badge>
                ) : item.status === 'near_expiration' ? (
                  <Badge colorScheme="purple">Expirando</Badge>
                ) : item.status === 'renewing' ? (
                  <Badge colorScheme="blue">Renovando</Badge>
                ) : item.status === 'not_necessary' ? (
                  <Badge colorScheme="grayBlue">Não necessária</Badge>
                ) : (
                  <Badge colorScheme="grayBlue">Não necessária</Badge>
                ),
              fiscalLicenseName: (
                <Link
                  as={LinkRouterDom}
                  to={`/client/companies/${companyId}/documents/${item.clientNationalRegistrationId}/${
                    item.fiscalLicenseName !== 'CNPJ' && item.fiscalLicenseName !== 'Cartão CNPJ'
                      ? item.clientNationalRegistrationFiscalRegistrationId +
                        (item.fiscalLicenseId
                          ? '?cnae_level=' +
                            cnaeLevel +
                            '&license=' +
                            item.fiscalLicenseId +
                            '&cnae=' +
                            item.fiscalRegistrationCodeClass
                          : '?cnae_level=' + cnaeLevel)
                      : '?cnae_level=' + cnaeLevel
                  }`}
                  fontWeight="semibold"
                  color="blue.400"
                >
                  {item.fiscalLicenseName}
                </Link>
              ),
              fiscalRegistrationCodeDescription: <Text fontSize="xs">{item.fiscalRegistrationCodeDescription}</Text>,
              clientNationalRegistrationCode: (
                <Text title={item.clientNationalFantasyName}>
                  {item.clientNationalRegistrationCode.replace(
                    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                    '$1.$2.$3/$4-$5'
                  )}
                </Text>
              ),
              fiscalRegistrationCodeClass: (
                <Text title={item.fiscalRegistrationCodeDescription}>{item.fiscalRegistrationCodeClass}</Text>
              ),
              fiscalLicenseImpact: (
                <Icon as={signals[item.fiscalLicenseImpact] || signals[0]} boxSize={6} color="grayBlue.600" />
              ),
              fiscalLicenseComplexity: (
                <Icon as={signals[item.fiscalLicenseComplexity] || signals[0]} boxSize={6} color="grayBlue.600" />
              ),
              validUntil: item.validUntil ? date(item.validUntil, "dd' 'MMM' 'yyyy'") : 'Sem validade',
              updatedAt: date(item.updatedAt ? item.updatedAt.date : 'Não alterado'),
              options: (
                <HStack spacing="2">
                  <IconButton
                    icon={<RiFileList2Fill />}
                    title="Visualizar documentos"
                    aria-label="File view"
                    isDisabled={!getLicensesCan}
                    as={LinkRouterDom}
                    to={`/client/companies/${companyId}/documents/${item.clientNationalRegistrationId}/${
                      item.fiscalLicenseName !== 'CNPJ' && item.fiscalLicenseName !== 'Cartão CNPJ'
                        ? item.clientNationalRegistrationFiscalRegistrationId +
                          (item.fiscalLicenseId
                            ? '?cnae_level=' +
                              cnaeLevel +
                              '&license=' +
                              item.fiscalLicenseId +
                              '&cnae=' +
                              item.fiscalRegistrationCodeClass
                            : '?cnae_level=' + cnaeLevel)
                        : '?cnae_level=' + cnaeLevel
                    }`}
                    isDisabled={!updateLicensesCan ? true : false}
                    variant="ghost"
                    fontSize="28"
                    color="grayBlue.400"
                    cursor="pointer"
                    _hover={{
                      color: 'blue.400',
                      bgColor: 'grayBlue.200',
                    }}
                  />
                  <IconButton
                    icon={<RiFileAddFill />}
                    title="Adicionar licença"
                    aria-label="Add license"
                    isDisabled={!createLicensesCan || !updateLicensesCan}
                    onClick={() => handleAddItem(item)}
                    variant="ghost"
                    fontSize="28"
                    color="grayBlue.400"
                    cursor="pointer"
                    _hover={{
                      color: 'blue.400',
                      bgColor: 'grayBlue.200',
                    }}
                  />
                </HStack>
              ),
            });
          });
          setData(dataFormatted);
        };

        getData(data.result[0].items || []);
      } catch (error) {
        toast({
          title: 'Não foi possível carregar as licenças.',
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
    [searchDelayed, page, limit, cnpjData, cnaeData, sort, direction]
  );

  const handleAddItem = (val = {}) => {
    setAddItem(val);
  };

  const columns = useMemo(
    () => [
      'ID',
      'Status',
      'Licença',
      'Descrição',
      'CNPJ',
      'CNAE',
      'Risco',
      'Complexidade',
      'Validade',
      'Edição',
      'Opções',
    ],
    []
  );

  const searchData = (page) => {
    if (companyId > 0) {
      fetchCompany();
      fetchData(page);
    }
  };

  const CnpjoptionsRequest = async () => {
    let reqCnpj = await ClientCompany.cnpjIndex(companyId, `&limit=500000`);
    let cnpjOptionObj = reqCnpj.data.items.map((i) => {
      return {
        value: i.id,
        label:
          i.registrationCode +
          ' - ' +
          (i.systemStateAlias ? i.systemStateAlias : 'n/d') +
          ' - ' +
          (i.systemCityName ? i.systemCityName : 'n/d'),
      };
    });
    setCnpjOptions(cnpjOptionObj);
  };

  /* const CnaeoptionsRequest = async () => {
    let reqCnae = await ClientCompany.cnaeIndex(companyId, `limit=500000`);
    let cnaeOptionObj = reqCnae.data.items.map((i) => {
      return {
        value: i.value,
        label: (
          <>
            {i.label}
            <Icon as={MdSignalCellular1Bar} color="green.400" w={4} h={4} ms="2" title="Risco Baixo" />
          </>
        ),
      };
    });

    setCnaeOptions(cnaeOptionObj);
  }; */

  const handleFilterCnpj = (items) => {
    let str = '';
    items?.map((item) => {
      str += `"${item.label.slice(0, 14)}",`;
    });
    setCnpjData(str.slice(0, -1));
  };

  const handleFilterCnae = (items) => {
    let str = '';
    items?.map((item) => {
      str += `"${item.label.props.children[0]}",`;
    });
    setCnaeData(str.slice(0, -1));
  };

  useEffect(() => {
    searchData(page);
    CnpjoptionsRequest();
    /* CnaeoptionsRequest(); */
    setSearchEmpty(false);
  }, [cnaeLevel, searchDelayed, page, limit, searchEmpty, cnpjData, cnaeData, sort, direction]);

  return (
    <>
      <Content>
        <Paper
          title="Licenças"
          fluid
          loading={loading}
          sizeTitle="md"
          options={
            <Stack
              direction={['column', 'column', 'row', 'row']}
              minW={['100%', '100%', '300px', '400px', '400px', '500px', '600px', '700px']}
              spacing="4"
              align="center"
            >
              <FormLabel>Filtrar </FormLabel>
              <Select
                name="CNPJs"
                onChange={(e) => handleFilterCnpj(e)}
                options={cnpjOptions}
                placeholder="CNPJs"
                size="sm"
              />
              <Select
                name="CNAEs"
                onChange={(e) => handleFilterCnae(e)}
                options={cnaeOptions}
                placeholder="CNAEs"
                size="sm"
              />
            </Stack>
          }
        >
          {getLicensesCan ? (
            <DefaultTable
              columns={columns}
              data={data}
              page={page}
              total={total}
              limit={limit}
              loading={loading}
              valueSearch={search}
              handlePageChange={(item) => {
                setPage(item);
              }}
              handleSearch={(e) => {
                if (e.key === 'Enter') {
                  setPage(0);
                  setSearch(e.target.value);
                } else {
                  setPage(0);
                  setSearch(e.target.value);
                }
              }}
              handleClearSearch={() => {
                setPage(0);
                setSearch('');
                setSearchEmpty(true);
              }}
              fetchData={() => fetchData(0)}
              handlePerRowsChange={(event) => {
                setLimit(event.target.value);
              }}
              pagesInRange={pagesInRange}
            />
          ) : (
            <Result
              title="Acesso restrito"
              description="Você não tem permissão para visualizar esta listagem."
              icon={ImBlocked}
            />
          )}
        </Paper>
      </Content>

      {createLicensesCan ? (
        <Create
          companyId={companyId}
          companyName={company.name}
          isOpen={Object.keys(addItem).length > 0}
          dataItem={addItem}
          onClose={() => {
            handleAddItem({});
            fetchData(page);
          }}
        />
      ) : null}
    </>
  );
}
