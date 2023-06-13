import React, { useCallback, useEffect, useState, useMemo } from 'react';
import nprogress from 'nprogress';
import { AdminLicense } from 'services';

import { useDelayedValue } from 'hooks/useDelayedValue';
import { date, daysDistance } from 'utils/format';
import { RiDeleteBin2Fill, RiEdit2Fill } from 'react-icons/ri';

import Breadcrumbs from 'components/Breadcrumbs';
import { Content, Paper } from 'components/Content';
import DefaultTable from 'components/Tables/DefaultTable';

import { useToast, HStack, Button, Badge, Icon, Text, IconButton, Link } from '@chakra-ui/react';

import Create from './create';
import Update from './update';
import Delete from './delete';

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

export default () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pagesInRange, setPagesInRange] = useState([]);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(20);
  const [newItem, setNewItem] = useState(false);
  const [editItem, setEditItem] = useState(0);
  const [deleteItem, setDeleteItem] = useState(0);

  const searchDelayed = useDelayedValue(search, 1000);

  const fetchData = useCallback(
    async (page) => {
      setLoading(true);
      nprogress.start();
      setPage(page);
      try {
        const { data } = await AdminLicense.index(`&search=${searchDelayed}&page=${page}&limit=${limit}`);
        setPagesInRange(data.pages_in_range);
        setTotal(Number(data.total) || 0);

        const getData = (items) => {
          let dataFormatted = [];
          items.map((item) => {
            dataFormatted.push({
              id: parseInt(item.id),
              name: (
                <Link
                  onClick={() => setEditItem(item.id)}
                  color={item.enabled ? 'blue.400' : 'red.500'}
                  fontWeight="semibold"
                  alt={item.name}
                >
                  {item.name}
                  {!item.enabled && <Badge colorScheme="red">Inativo</Badge>}

                  {daysDistance(new Date(item.createdAt?.date), 30) && <Badge colorScheme="purple">Novo</Badge>}
                </Link>
              ),
              impact: <Icon as={signals[item.impact] || signals[0]} boxSize={6} color="grayBlue.600" />,
              complexity: <Icon as={signals[item.complexity] || signals[0]} boxSize={6} color="grayBlue.600" />,
              estimatedEffort: item.estimatedEffort,
              estimatedBureaucratic: item.estimatedBureaucratic,
              estimatedValid: item.estimatedValid,
              totalCnaes: item.totalCnaes,
              createdUpdatedAt: (
                <>
                  <Text>{date(item.createdAt ? item.createdAt.date : '')}</Text>
                  <Text>{date(item.updatedAt ? item.updatedAt.date : '')}</Text>
                </>
              ),
              options: (
                <HStack spacing="2">
                  <IconButton
                    icon={<RiEdit2Fill />}
                    title="Editar"
                    aria-label="Edit"
                    variant="ghost"
                    fontSize="28"
                    color="grayBlue.400"
                    cursor="pointer"
                    _hover={{
                      color: 'blue.400',
                      bgColor: 'grayBlue.200',
                    }}
                    onClick={() => setEditItem(item.id)}
                  />
                  <IconButton
                    icon={<RiDeleteBin2Fill />}
                    title="Excluir"
                    aria-label="Delete"
                    variant="ghost"
                    fontSize="28"
                    color="grayBlue.400"
                    cursor="pointer"
                    _hover={{
                      color: 'red.400',
                      bgColor: 'grayBlue.200',
                    }}
                    onClick={() => setDeleteItem(item.id)}
                  />
                </HStack>
              ),
            });
          });
          setData(dataFormatted);
        };
        getData(data.items || []);
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
    [searchDelayed, limit, page]
  );

  useEffect(() => {
    fetchData(page);
  }, [searchDelayed, page, limit]);

  const columns = useMemo(
    () => [
      'ID',
      'Nome',
      'Risco',
      'Complexidade',
      'Esforço',
      'Burocracia',
      'Validade',
      'CNAEs',
      'Criação/Edição',
      'Opções',
    ],
    []
  );

  return (
    <>
      <Breadcrumbs title="Licenças" pages={[{ page: 'Início', link: '/admin/dashboard' }]} />

      <Content>
        <Paper
          title="Licenças"
          fluid
          loading={loading}
          options={<Button onClick={() => setNewItem(true)}>Adicionar</Button>}
        >
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
        </Paper>
      </Content>

      <Create
        isOpen={newItem}
        onClose={() => {
          setNewItem(false);
          fetchData(page);
        }}
      />
      <Update
        id={editItem}
        isOpen={!!editItem}
        onClose={() => {
          setEditItem(0);
          fetchData(page);
        }}
      />
      <Delete
        id={deleteItem}
        isOpen={!!deleteItem}
        onClose={() => {
          setDeleteItem(0);
          fetchData(page);
        }}
      />
    </>
  );
};
