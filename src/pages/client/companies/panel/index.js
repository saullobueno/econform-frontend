import React, { useState, useEffect, useCallback } from 'react';
import nprogress from 'nprogress';
import { Link as LinkRouterDom, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { ClientCompany } from 'services';
import Geocode from 'react-geocode';

import { Loading } from 'components/Loading';
import Breadcrumbs from 'components/Breadcrumbs';
import MainTab from 'components/Tabs/MainTab';
import PieChart from 'components/Charts';
import { Content, Paper } from 'components/Content';
import { GoogleMapComponent } from 'components/GoogleMaps';

import { MdDashboard, MdLibraryBooks, MdAccountBalance } from 'react-icons/md';
import { RiFilePaper2Line } from 'react-icons/ri';
import { useCan } from 'hooks/useCan';
import {
  useToast,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  VStack,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { HiChevronDown } from 'react-icons/hi';

Geocode.setApiKey('AIzaSyC7rjTylpZDrH_OAKIGSBiAK2zoHZinWdk');
Geocode.setLanguage('en');
Geocode.setRegion('es');

export default function ClientCompaniesPanelPage() {
  const toast = useToast();
  let { id: companyId } = useParams();
  let { search: argsLocation } = useLocation();
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [loadingLicenses, setLoadingLicenses] = useState(true);
  const [address, setAddress] = useState([]);
  const [locationsCNPJs, setLocationsCNPJs] = useState([]);
  const [licensesStatus, setLicensesStatus] = useState([]);

  const fetchAddress = useCallback(async (companyId) => {
    setLoadingAddress(true);
    nprogress.start();
    try {
      const { data } = await ClientCompany.addressIndex(companyId);
      setAddress(data.result);
      data.result?.map((location, i) => {
        setLocationsCNPJs((locationsCNPJs) => [
          ...locationsCNPJs,
          { lat: Number(location.geocodeLatitude), lng: Number(location.geocodeLongitude) },
        ]);
      });
    } catch (error) {
      toast({
        title: 'Não foi possível carregar os endereços.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    setLoadingAddress(false);
    nprogress.done();
  }, []);

  const fetchLicensesStatus = useCallback(async (companyId, argsLocation) => {
    setLoadingLicenses(true);
    nprogress.start();
    try {
      const { data } = await ClientCompany.licensesStatus(companyId, argsLocation);
      setLicensesStatus(data.result);
    } catch (error) {
      toast({
        title: 'Não foi possível carregar os status das licenças.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    setLoadingLicenses(false);
    nprogress.done();
  }, []);

  useEffect(() => {
    fetchAddress(companyId);
    fetchLicensesStatus(companyId, argsLocation);
  }, [companyId, argsLocation]);

  var data = licensesStatus.map((item, idx) => ({
    id: idx,
    type:
      item.status === 'in_conformity'
        ? 'Em conformidade'
        : item.status === 'pending'
        ? 'Pendente'
        : item.status === 'license_expired'
        ? 'Vencidas'
        : item.status === 'near_expiration'
        ? 'Expirando'
        : item.status === 'renewing'
        ? 'Renovando'
        : item.status === 'not_necessary'
        ? 'Não necessárias'
        : 'Não encontradas',
    value: item.total !== 0 ? item.total : null,
    color:
      item.status === 'in_conformity'
        ? '#2ed47a'
        : item.status === 'pending'
        ? '#ffb946'
        : item.status === 'license_expired'
        ? '#f7685b'
        : item.status === 'near_expiration'
        ? '#885AF8'
        : item.status === 'renewing'
        ? '#109CF1'
        : item.status === 'not_necessary'
        ? '#666'
        : '#000',
  }));

  return (
    <Content>
      <Paper title="Localizações de cada CNPJ" loading={loadingAddress} sizeTitle="md">
        <GoogleMapComponent isMarkerShown markers={locationsCNPJs} />
      </Paper>
      <Paper title="Licenças" loading={loadingLicenses} sizeTitle="md">
        {!loadingLicenses && (
          <>
            <Stack direction={{ base: 'column', '4xl': 'row' }} align="center" justify="center" spacing="4">
              <Box>
                <PieChart data={data} name="Licenças" />
              </Box>
              <VStack align="start" justify="center">
                {licensesStatus.map((item, i) => (
                  <Text key={i}>
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
                        item.status === 'in_conformity'
                          ? '#2ed47a'
                          : item.status === 'pending'
                          ? '#ffb946'
                          : item.status === 'license_expired'
                          ? '#f7685b'
                          : item.status === 'near_expiration'
                          ? '#885AF8'
                          : item.status === 'renewing'
                          ? '#109CF1'
                          : item.status === 'not_necessary'
                          ? '#666'
                          : '#000'
                      }
                    ></Box>{' '}
                    <Text as="strong">{item.total}</Text>{' '}
                    {item.status === 'in_conformity'
                      ? 'Em conformidade'
                      : item.status === 'pending'
                      ? 'Pendente'
                      : item.status === 'license_expired'
                      ? 'Vencidas'
                      : item.status === 'near_expiration'
                      ? 'Expirando'
                      : item.status === 'renewing'
                      ? 'Renovando'
                      : item.status === 'not_necessary'
                      ? 'Não necessária'
                      : 'Não encontradas'}
                  </Text>
                ))}
              </VStack>
            </Stack>
          </>
        )}
      </Paper>
    </Content>
  );
}
