import React, { useCallback, useEffect, useState, useMemo } from 'react';
import nprogress from 'nprogress';
import { ClientUser } from 'services';
import { useAuth } from 'context/auth';
import { useToast, Button, Badge, IconButton, HStack, Link, Text, Avatar, Box, Icon } from '@chakra-ui/react';

import Breadcrumbs from 'components/Breadcrumbs';
import { Content, Paper } from 'components/Content';
import DefaultTable from 'components/Tables/DefaultTable';
import Result from 'components/Result';
import { useDelayedValue } from 'hooks/useDelayedValue';
import { useCan } from 'hooks/useCan';

import { RiDeleteBin2Fill, RiEdit2Fill } from 'react-icons/ri';
import { ImBlocked } from 'react-icons/im';

import { date, daysDistance } from 'utils/format';

import Create from './create';
import Delete from './delete';
import Update from './update';

export default () => {
  const toast = useToast();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const getUserCan = useCan({ permission_role: ['GET_USER'] });
  const createUserCan = useCan({ permission_role: ['CREATE_USER'] });
  const updateUserCan = useCan({ permission_role: ['UPDATE_USER'] });
  const deleteUserCan = useCan({ permission_role: ['DELETE_USER'] });
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
        const { data } = await ClientUser.index(`&search=${searchDelayed}&page=${page}&limit=${limit}`);
        setPagesInRange(data.pages_in_range);
        setTotal(Number(data.total) || 0);

        const getData = (items) => {
          let dataFormatted = [];
          items.map((item) => {
            dataFormatted.push({
              id: parseInt(item.id),
              nameEmail: (
                <HStack spacing="4">
                  <Avatar name={item.name} bgColor="grayBlue.400" color="white" size="sm" />
                  <Box>
                    <Link
                      color={item.enabled ? 'blue.400' : 'red.500'}
                      fontWeight="semibold"
                      onClick={auth.email === item.email || updateUserCan ? () => setEditItem(item.id) : () => {}}
                    >
                      {item.name}
                      {!item.enabled && <Badge colorScheme="red">Inativo</Badge>}

                      {daysDistance(new Date(item.createdAt?.date), 30) && <Badge colorScheme="purple">Novo</Badge>}
                    </Link>
                    <Text color="grayBlue.700">{item.email}</Text>
                  </Box>
                </HStack>
              ),
              systemRole:
                item.systemRole === 'ECONFORM' ? (
                  <Badge colorScheme="green">eConform</Badge>
                ) : item.systemRole === 'PARTNER' ? (
                  <Badge colorScheme="blue">Parceiro</Badge>
                ) : item.systemRole === 'ADMIN' ? (
                  <Badge colorScheme="green">Administrador</Badge>
                ) : item.systemRole === 'USER' ? (
                  <Badge colorScheme="blue">Usuário</Badge>
                ) : (
                  <Badge color="white">{item.systemRole || 'n/d'}</Badge>
                ),
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
                    isDisabled={!updateUserCan}
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
                    isDisabled={!deleteUserCan}
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
          title: 'Não foi possível carregar os usuários.',
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
    [auth, searchDelayed, updateUserCan, page, limit]
  );

  const columns = useMemo(() => ['ID', 'Usuário', 'Tipo', 'Criação/Edição', 'Opções'], []);

  useEffect(() => {
    fetchData(page);
  }, [searchDelayed, updateUserCan, page, limit]);

  return (
    <>
      <Breadcrumbs
        title="Usuários"
        pages={[{ page: localStorage.getItem('@eConform-ClientName') || 'Início', link: '/client/dashboard' }]}
      />

      <Content>
        <Paper
          title="Usuários"
          fluid
          loading={loading}
          options={
            <Button type="button" onClick={() => setNewItem(true)} isDisabled={!createUserCan}>
              Adicionar
            </Button>
          }
        >
          {getUserCan ? (
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

      {createUserCan && (
        <Create
          isOpen={newItem}
          onClose={() => {
            setNewItem(false);
            fetchData(page);
          }}
        />
      )}

      {updateUserCan && (
        <Update
          id={editItem}
          isOpen={!!editItem}
          onClose={() => {
            setEditItem(0);
            fetchData(page);
          }}
        />
      )}

      {deleteUserCan && (
        <Delete
          id={deleteItem}
          isOpen={!!deleteItem}
          onClose={() => {
            setDeleteItem(0);
            fetchData(page);
          }}
        />
      )}
    </>
  );
};
