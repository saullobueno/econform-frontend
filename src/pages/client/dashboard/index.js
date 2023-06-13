import React, { useCallback, useEffect, useState } from 'react';
import nprogress from 'nprogress';
import { ClientDashboard } from 'services';

import { Box, Stack, VStack, HStack, Heading, Icon, Text, useToast, Grid, GridItem } from '@chakra-ui/react';
import Breadcrumbs from 'components/Breadcrumbs';
import { Content, Paper } from 'components/Content';
import PieChart from 'components/Charts';

import { RiStore2Line, RiFileList3Line, RiFileCopy2Line } from 'react-icons/ri';

import { GoogleMapComponent } from 'components/GoogleMaps';

export default function DashboardPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [locationsCNPJs, setLocationsCNPJs] = useState([]);

  const fetchData = useCallback(async (page) => {
    setLoading(true);
    nprogress.start();
    try {
      const { data } = await ClientDashboard.index(``);
      setData(data);
      console.log('KPIS: ', data);
      data.address?.map((location, i) => {
        setLocationsCNPJs((locationsCNPJs) => [
          ...locationsCNPJs,
          { lat: Number(location.geocode_latitude), lng: Number(location.geocode_longitude) },
        ]);
      });
    } catch (error) {
      toast({
        title: 'Não foi possível carregar os dados.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    setLoading(false);
    nprogress.done();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  var dataLicenses = [
    {
      type: 'Em conformidade',
      value: data?.licenses?.in_conformity || 0,
      color: '#2ed47a',
    },
    {
      type: 'Pendente',
      value: data?.licenses?.pending || 0,
      color: '#ffb946',
    },
    {
      type: 'Vencidas',
      value: data?.licenses?.license_expired || 0,
      color: '#f7685b',
    },
    {
      type: 'Expirando',
      value: data?.licenses?.near_expiration || 0,
      color: '#885AF8',
    },
    {
      type: 'Renovando',
      value: data?.licenses?.renewing || '0',
      color: '#109CF1',
    },
    {
      type: 'Não necessárias',
      value: data?.licenses?.not_necessary || 0,
      color: '#666',
    },
    {
      type: 'Não encontradas',
      value: 0,
      color: '#000',
    },
  ];

  var dataSituations = [
    {
      type: 'Ativas',
      value: data?.situations?.active || 0,
      color: '#2ed47a',
    },
    {
      type: 'Suspensas',
      value: data?.situations?.suspended || 0,
      color: '#ffb946',
    },
    {
      type: 'Baixadas',
      value: data?.situations?.closed || 0,
      color: '#f7685b',
    },
  ];

  const ItemLicense = ({ name, value }) => {
    return (
      <Text>
        <Box
          as="span"
          display="inline-block"
          width="30px"
          height="20px"
          marginRight="1rem"
          borderRadius="10px"
          verticalAlign="middle"
          borderWidth="5px"
          borderColor={
            name === 'in_conformity'
              ? '#2ed47a'
              : name === 'pending'
              ? '#ffb946'
              : name === 'license_expired'
              ? '#f7685b'
              : name === 'near_expiration'
              ? '#885AF8'
              : name === 'renewing'
              ? '#109CF1'
              : name === 'not_necessary'
              ? '#666'
              : '#000'
          }
        ></Box>{' '}
        <Text as="strong">{value}</Text>{' '}
        {name === 'in_conformity'
          ? 'Em conformidade'
          : name === 'pending'
          ? 'Pendente'
          : name === 'license_expired'
          ? 'Vencidas'
          : name === 'near_expiration'
          ? 'Expirando'
          : name === 'renewing'
          ? 'Renovando'
          : name === 'not_necessary'
          ? 'Não necessária'
          : 'Não encontradas'}
      </Text>
    );
  };
  const ItemDocument = ({ name, value }) => {
    return (
      <Text>
        <Box
          as="span"
          display="inline-block"
          width="30px"
          height="20px"
          marginRight="1rem"
          borderRadius="10px"
          verticalAlign="middle"
          borderWidth="5px"
          borderColor={
            name === 'active'
              ? '#2ed47a'
              : name === 'inactive' || name === 'suspended' || name === 'inapta'
              ? '#ffb946'
              : name === 'closed'
              ? '#f7685b'
              : '#ccc'
          }
        ></Box>{' '}
        <Text as="strong">{value}</Text>{' '}
        {name === 'active'
          ? 'Ativas'
          : name === 'inactive' || name === 'suspended' || name === 'inapta'
          ? 'Suspensas'
          : name === 'closed'
          ? 'Baixadas'
          : 'Não definida'}
      </Text>
    );
  };
  return (
    <>
      <Breadcrumbs
        title="Início"
        pages={[{ page: localStorage.getItem('@eConform-ClientName') || 'Início', link: '/client/dashboard' }]}
      />

      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
          '4xl': 'repeat(6, 1fr)',
        }}
        gap={{
          base: 4,
          xl: 8,
        }}
        paddingBottom={{
          base: 4,
          xl: 8,
        }}
      >
        <GridItem>
          <Paper
            loading={loading}
            padding={{
              base: '4',
              xl: '8',
            }}
            fluid
          >
            <HStack>
              <Icon as={RiStore2Line} boxSize={12} color="blue.400" marginRight="4" />
              <Box>
                <Heading size="xs" color="grayBlue.500">
                  Empresas cadastradas
                </Heading>
                <Text fontSize="2xl" fontWeight="semibold" color="grayBlue.600">
                  {data?.companies}
                </Text>
              </Box>
            </HStack>
          </Paper>
        </GridItem>
        <GridItem>
          <Paper
            loading={loading}
            padding={{
              base: '4',
              xl: '8',
            }}
            fluid
          >
            <HStack>
              <Icon as={RiFileCopy2Line} boxSize={12} color="blue.400" marginRight="4" />
              <Box>
                <Heading size="xs" color="grayBlue.500">
                  Documentos enviados
                </Heading>
                <Text fontSize="2xl" fontWeight="semibold" color="grayBlue.600">
                  {data?.documents}
                </Text>
              </Box>
            </HStack>
          </Paper>
        </GridItem>
        <GridItem>
          <Paper
            loading={loading}
            padding={{
              base: '4',
              xl: '8',
            }}
            fluid
          >
            <HStack>
              <Icon as={RiFileList3Line} boxSize={12} color="blue.400" marginRight="4" />
              <Box>
                <Heading size="xs" color="grayBlue.500">
                  CNPJs adicionados
                </Heading>
                <Text fontSize="2xl" fontWeight="semibold" color="grayBlue.600">
                  {data?.cnpjs?.count}
                </Text>
              </Box>
            </HStack>
          </Paper>
        </GridItem>
        <GridItem>
          <Paper
            loading={loading}
            padding={{
              base: '4',
              xl: '8',
            }}
            fluid
          >
            <HStack>
              <Icon as={RiFileList3Line} boxSize={12} color="green.400" marginRight="4" />
              <Box>
                <Heading size="xs" color="grayBlue.500">
                  CNPJs de Risco Baixo
                </Heading>
                <Text fontSize="2xl" fontWeight="semibold" color="green.400">
                  {data?.cnpjs?.low_level}
                </Text>
              </Box>
            </HStack>
          </Paper>
        </GridItem>
        <GridItem>
          <Paper
            loading={loading}
            padding={{
              base: '4',
              xl: '8',
            }}
            fluid
          >
            <HStack>
              <Icon as={RiFileList3Line} boxSize={12} color="yellow.400" marginRight="4" />
              <Box>
                <Heading size="xs" color="grayBlue.500">
                  CNPJs de Risco Médio
                </Heading>
                <Text fontSize="2xl" fontWeight="semibold" color="yellow.400">
                  {data?.cnpjs?.medium_level}
                </Text>
              </Box>
            </HStack>
          </Paper>
        </GridItem>
        <GridItem>
          <Paper
            loading={loading}
            padding={{
              base: '4',
              xl: '8',
            }}
            fluid
          >
            <HStack>
              <Icon as={RiFileList3Line} boxSize={12} color="red.400" marginRight="4" />
              <Box>
                <Heading size="xs" color="grayBlue.500">
                  CNPJs de Risco Alto
                </Heading>
                <Text fontSize="2xl" fontWeight="semibold" color="red.400">
                  {data?.cnpjs?.high_level}
                </Text>
              </Box>
            </HStack>
          </Paper>
        </GridItem>
      </Grid>

      <Content>
        <Paper title="Localizações" loading={loading} fluid>
          <GoogleMapComponent isMarkerShown markers={locationsCNPJs} />
        </Paper>
      </Content>

      <Content>
        <Paper title="Licenças" loading={loading}>
          {!loading && (
            <>
              <Stack direction={{ base: 'column', '4xl': 'row' }} align="center" justify="center" spacing="4">
                <Box>
                  <PieChart data={dataLicenses} name="Licenças" />
                </Box>
                <VStack align="start" justify="center">
                  <ItemLicense name="in_conformity" value={data.licenses?.in_conformity} />
                  <ItemLicense name="pending" value={data.licenses?.pending} />
                  <ItemLicense name="license_expired" value={data.licenses?.license_expired} />
                  <ItemLicense name="near_expiration" value={data.licenses?.near_expiration} />
                  <ItemLicense name="renewing" value={data.licenses?.renewing ? data.licenses?.renewing : '0'} />
                  <ItemLicense name="not_necessary" value={data.licenses?.renewing ? data.licenses?.renewing : '0'} />
                </VStack>
              </Stack>
            </>
          )}
        </Paper>
        <Paper title="Situação das empresas" loading={loading}>
          {!loading && (
            <>
              <Stack direction={{ base: 'column', '4xl': 'row' }} align="center" justify="center" spacing="4">
                <Box>
                  <PieChart data={dataSituations} name="Empresas" />
                </Box>
                <VStack align="start" justify="center">
                  <ItemDocument name="active" value={data.situations?.active} />
                  <ItemDocument name="suspended" value={data.situations?.suspended} />
                  <ItemDocument name="closed" value={data.situations?.closed} />
                </VStack>
              </Stack>
            </>
          )}
        </Paper>
      </Content>
    </>
  );
}
