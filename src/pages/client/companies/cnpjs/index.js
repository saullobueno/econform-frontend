import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import nprogress from 'nprogress';
import { useParams, useSearchParams } from 'react-router-dom';
import { ClientCompany } from 'services';

import DefaultTable from 'components/Tables/DefaultTable';
import { Content, Paper } from 'components/Content';
import Result from 'components/Result';

import { useToast, Button, Badge, Text, HStack, IconButton, Icon } from '@chakra-ui/react';

import { RiDeleteBin2Fill } from 'react-icons/ri';
import { ImBlocked } from 'react-icons/im';

import Create from './create';
import Delete from './delete';

import { useDelayedValue } from 'hooks/useDelayedValue';
import { date, daysDistance } from 'utils/format';
import { useCan } from 'hooks/useCan';

export default function ClientCompaniesSettingsCNPJsPage() {
  let { id: companyId } = useParams();
  const [searchParams] = useSearchParams();
  const [cnaeLevel, setCnaeLevel] = useState(searchParams.get('cnae_level'));
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const createCNPJCan = useCan({ permission_role: ['CREATE_CNPJ'] });
  const deleteCNPJCan = useCan({ permission_role: ['DELETE_CNPJ'] });
  const getCNPJCan = useCan({ permission_role: ['GET_CNPJ'] });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pagesInRange, setPagesInRange] = useState([]);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState('et.id');
  const [direction, setDirection] = useState('desc');
  const [newItem, setNewItem] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [registrationCodeItem, setRegistrationCodeItem] = useState(false);
  const searchDelayed = useDelayedValue(search, 1000);
  let navigate = useNavigate();

  const columns = useMemo(
    () => ['ID', 'Tipo', 'Empresa/CNPJ', 'Município/UF', 'Situação', 'Registro', 'Data de registro', 'Opções'],
    []
  );

  const fetchData = useCallback(
    async (page) => {
      setLoading(true);
      nprogress.start();
      setPage(page);
      try {
        const { data } = await ClientCompany.cnpjIndex(
          companyId,
          `&search=${searchDelayed}&page=${page}&limit=${limit}&sort=${sort}&direction=${direction}`
        );
        setPagesInRange(data.page_in_range);
        setTotal(Number(data.total || 0));

        const getData = (items) => {
          if (items?.length > 0) {
            let dataFormatted = [];
            items.map((item) => {
              dataFormatted.push({
                id: parseInt(item.id),
                type:
                  item.type === 'MATRIZ' ? (
                    <Badge colorScheme="purple">Matriz</Badge>
                  ) : (
                    <Badge colorScheme="blue">Filial</Badge>
                  ),
                registrationName: (
                  <>
                    <Text
                      fontWeight="semibold"
                      color={item.enabled ? 'grayBlue.500' : 'red.400'}
                      textTransform="capitalize"
                      casing="capitalize"
                    >
                      {item.registrationName}
                      {!item.enabled && <Badge colorScheme="red">Inativo</Badge>}

                      {daysDistance(new Date(item.registrationSituationDate?.date), 30) && (
                        <Badge colorScheme="purple">Novo</Badge>
                      )}
                    </Text>
                    <Text>
                      {item.registrationCode.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}
                    </Text>
                  </>
                ),
                systemCityNameStateAlias: (
                  <Text>
                    {item.systemCityName} / {item.systemStateAlias}
                  </Text>
                ),
                registrationSituation: item.registrationSituation,
                registrationStatus: item.registrationStatus,
                registrationSituationDate: item.registrationSituationDate.date
                  ? date(item.registrationSituationDate.date)
                  : 'n/a',
                options: (
                  <HStack spacing="2">
                    <IconButton
                      icon={<RiDeleteBin2Fill />}
                      title="Excluir"
                      aria-label="Delete"
                      isDisabled={!deleteCNPJCan}
                      variant="ghost"
                      fontSize="28"
                      color="grayBlue.400"
                      cursor="pointer"
                      _hover={{
                        color: 'red.400',
                        bgColor: 'grayBlue.200',
                      }}
                      onClick={() => {
                        setDeleteItem(true);
                        setRegistrationCodeItem(item.registrationCode);
                      }}
                    />
                  </HStack>
                ),
              });
            });
            setData(dataFormatted);
          } else {
            navigate('/client/companies', { replace: true });
          }
        };
        getData(data?.items || []);
      } catch (error) {
        toast({
          title: 'Não foi possível carregar os CNPJs.',
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
    [searchDelayed, page, limit, sort, direction]
  );

  useEffect(() => {
    if (companyId > 0) {
      fetchData(page);
    }
  }, [cnaeLevel, searchDelayed, page, limit, sort, direction]);

  return (
    <>
      <Content>
        <Paper
          title="CNPJs"
          fluid
          loading={loading}
          sizeTitle="md"
          options={
            <Button type="button" onClick={() => setNewItem(true)} isDisabled={!createCNPJCan}>
              Adicionar
            </Button>
          }
        >
          {getCNPJCan ? (
            <DefaultTable
              columns={columns}
              data={data}
              page={page}
              total={total}
              limit={limit}
              loading={loading}
              valueSearch={search}
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
              }}
              fetchData={() => fetchData(0)}
              handlePerRowsChange={(event) => {
                setLimit(event.target.value);
              }}
              handlePageChange={(item) => {
                setPage(item);
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

      {createCNPJCan ? (
        <Create
          companyId={companyId}
          isOpen={newItem}
          onClose={() => {
            setNewItem(false);
            fetchData(page);
          }}
        />
      ) : null}

      {deleteCNPJCan ? (
        <Delete
          id={deleteItem}
          companyId={companyId}
          registrationCode={String(registrationCodeItem)}
          isOpen={!!deleteItem}
          onClose={() => {
            setDeleteItem(0);
            fetchData(page);
          }}
        />
      ) : null}
    </>
  );
}
