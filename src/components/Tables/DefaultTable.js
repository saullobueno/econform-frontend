import React from 'react';
import {
  Button,
  TableContainer,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  HStack,
  Select,
  Box,
  Stack,
} from '@chakra-ui/react';

import { Loading } from 'components/Loading';
import ButtonSearch from 'components/ButtonSearch';
import Pagination from 'components/Pagination';
import Result from 'components/Result';
import ShowingItemsLegend from 'components/Tables/ShowingItemsLegend';
import ItemsPerPage from 'components/Tables/ItemsPerPage';

import { RiFileSearchLine } from 'react-icons/ri';
import { BsInboxFill } from 'react-icons/bs';

export default function DefaultTable({
  data,
  columns,
  page,
  total = 0,
  limit,
  pagesInRange,
  loading = false,
  valueSearch,
  handleSearch,
  handleClearSearch,
  fetchData,
  handlePerRowsChange,
  handlePageChange = () => {},
}) {
  return (
    <>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        mb={(total == 0 || data.length == 0) && !valueSearch && !loading ? '0' : '8'}
        justify="space-between"
      >
        <ButtonSearch
          loading={loading}
          total={total}
          valueSearch={valueSearch}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
          fetchData={fetchData}
        />
        <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: '2', md: '8' }} align="center">
          <ShowingItemsLegend total={total} limit={limit} page={page} />
          <ItemsPerPage total={total} limit={limit} handlePerRowsChange={handlePerRowsChange} />
        </Stack>
      </Stack>

      {total > 0 && !loading ? (
        <>
          <TableContainer borderColor="grayBlue.100">
            <Table>
              <Thead>
                <Tr>
                  {columns?.map((column, i) => (
                    <Th key={i} whiteSpace="normal">
                      {column}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((row) => (
                  <Tr key={row.id}>
                    {Object.keys(row).map((cell, cellIndex) => (
                      <Td key={cellIndex} whiteSpace="normal">
                        {row[cell]}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <Pagination page={page} handlePageChange={handlePageChange} pagesInRange={pagesInRange} />
        </>
      ) : (total == 0 || data.length == 0) && valueSearch && !loading ? (
        <Result
          title={`Nada encontrado para "${valueSearch}"`}
          description="Escolha outro termo para buscar."
          icon={RiFileSearchLine}
          options={
            <Button type="button" variant="ghost" onClick={handleClearSearch}>
              Voltar à lista
            </Button>
          }
        />
      ) : (
        (total == 0 || data.length == 0) &&
        !loading && <Result title="Vazio" description="Não existem items cadastrados no momento." icon={BsInboxFill} />
      )}
    </>
  );
}
