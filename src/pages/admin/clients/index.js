import React, { useState, useEffect, useCallback } from 'react';
import nprogress from 'nprogress';
import { AdminClient } from 'services';
import { useAuth } from 'context/auth';

import {
  chakra,
  useToast,
  Button,
  Badge,
  Icon,
  IconButton,
  Text,
  HStack,
  SimpleGrid,
  VStack,
  Heading,
  Box,
  Stack,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
} from '@chakra-ui/react';

import Breadcrumbs from 'components/Breadcrumbs';
import { Content, Paper } from 'components/Content';
import ButtonSearch from 'components/ButtonSearch';
import Pagination from 'components/Pagination';
import Result from 'components/Result';
import ShowingItemsLegend from 'components/Tables/ShowingItemsLegend';
import ItemsPerPage from 'components/Tables/ItemsPerPage';

import { useDelayedValue } from 'hooks/useDelayedValue';
import { date, daysDistance } from 'utils/format';
import { RiEdit2Fill, RiDeleteBin2Fill, RiMore2Fill } from 'react-icons/ri';
import { BsInboxFill } from 'react-icons/bs';
import { AiOutlineFileSearch } from 'react-icons/ai';

import Create from './create';
import Update from './update';
import Delete from './delete';

export default () => {
  const { signInManager } = useAuth();
  const [loading, setLoading] = useState();
  const toast = useToast();
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
        const { data } = await AdminClient.index(`&search=${searchDelayed}&page=${page}&limit=${limit}`);
        setPagesInRange(data.pages_in_range);
        setData(data.items || []);
        setTotal(Number(data.total) || 0);
      } catch (error) {
        toast({
          title: 'Não foi possível carregar os clientes.',
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

  const handleSignInManager = (id) => {
    signInManager(id);
  };

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
  }, [searchDelayed, page, limit]);

  return (
    <>
      <Breadcrumbs title="Clientes" pages={[{ page: 'Início', link: '/admin/dashboard' }]} />

      <Content>
        <Paper
          title="Clientes"
          fluid
          loading={loading}
          options={<Button onClick={() => setNewItem(true)}>Adicionar</Button>}
        >
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
                {data?.map((client) => (
                  <VStack
                    key={client.id}
                    bgColor="grayBlue.100"
                    color="grayBlue.600"
                    fontSize="sm"
                    spacing="4"
                    p="4"
                    alignItems="left"
                    justify="space-between"
                    borderRadius="3px"
                    borderWidth="1px"
                    borderColor="grayBlue.100"
                    _hover={{ bgColor: 'grayBlue.200', textDecoration: 'none' }}
                  >
                    <HStack justify="space-between">
                      <Box>
                        <Heading
                          size="sm"
                          fontWeight="semibold"
                          color={client.enabled ? 'blue.400' : 'red.500'}
                          textTransform="capitalize"
                          onClick={() => handleSignInManager(client.id)}
                          _hover={{ cursor: 'pointer' }}
                        >
                          {client.name.toLowerCase()}
                          <chakra.span fontSize="3xs" color="grayBlue.500" ms="1">
                            ID{client.id}
                          </chakra.span>

                          {!client.enabled && <Badge colorScheme="red">Inativo</Badge>}
                          {daysDistance(new Date(client.createdAt?.date), 30) && (
                            <Badge colorScheme="purple">Novo</Badge>
                          )}
                        </Heading>
                        <chakra.span fontSize="sm" color="grayBlue.500">
                          <b>{client.totalCompanies || 0}</b> empresas
                        </chakra.span>
                      </Box>
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
                            <MenuItem icon={<RiEdit2Fill />} onClick={() => setEditItem(Number(client.id))}>
                              Editar
                            </MenuItem>
                            <MenuItem
                              icon={<RiDeleteBin2Fill />}
                              onClick={() => setDeleteItem(Number(client.id))}
                              color="red.500"
                            >
                              Excluir
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Box>
                    </HStack>
                    <VStack spacing="2" align="stretch">
                      <Text fontSize="xs" color="grayBlue.500">
                        Criado em {date(client.createdAt?.date) || 'n/d'}
                        <br />
                        Editado em {date(client.updatedAt?.date) || 'n/d'}
                      </Text>
                    </VStack>
                  </VStack>
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
              description="Adicione algum item para montar a lista."
              icon={BsInboxFill}
              options={
                <Button type="button" onClick={() => setNewItem(true)}>
                  Adicionar
                </Button>
              }
            />
          ) : null}
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
