import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, Link as LinkRouterDom, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { ClientCompany } from 'services';

import { useAuth } from 'context/auth';

import { Main, Page, ContentPage, Footer } from 'components/Content';
import SideBar from 'components/SideBar';

import Breadcrumbs from 'components/Breadcrumbs';
import MainTab from 'components/Tabs/MainTab';

import {
  MdDashboard,
  MdLibraryBooks,
  MdAccountBalance,
  MdSignalCellular1Bar,
  MdSignalCellular3Bar,
  MdSignalCellular4Bar,
} from 'react-icons/md';
import { RiFilePaper2Line } from 'react-icons/ri';
import { useCan } from 'hooks/useCan';
import {
  chakra,
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
import { daysDistance } from 'utils/format';

export default function DefaultLayout({ routesStore }) {
  const { auth, signOut } = useAuth();
  const toast = useToast();
  const [sidebarCompact, setSidebarCompact] = useState(false);
  let { id: companyId } = useParams();
  let location = useLocation();
  const tabCompany = location.pathname.split('/')[4];
  const [searchParams] = useSearchParams();
  const [cnaeLevel, setCnaeLevel] = useState(searchParams.get('cnae_level'));
  const [company, setCompany] = useState([]);
  const partnerCan = useCan({ access_role: ['PARTNER'] });
  const getCompanyCan = useCan({ permission_role: ['GET_COMPANY'] });
  const getCNPJCan = useCan({ permission_role: ['GET_CNPJ'] });
  const getLicensesCan = useCan({ permission_role: ['GET_LICENSES'] });
  const getFilesCan = useCan({ permission_role: ['GET_FILES'] });

  const fetchCompany = useCallback(async () => {
    try {
      if (companyId) {
        const { data } = await ClientCompany.readItem(companyId);
        setCompany(data);
      }
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

  useEffect(() => {
    fetchCompany();
  }, [companyId, cnaeLevel]);

  return (
    <Main>
      <SideBar
        sidebarCompact={sidebarCompact}
        btnCompact={() => setSidebarCompact(!sidebarCompact)}
        auth={auth}
        onClickLogout={signOut}
        routes={routesStore}
      />
      <Page sidebarCompact={sidebarCompact}>
        <ContentPage>
          {!!companyId && (
            <Breadcrumbs
              title={company.name}
              pages={[
                { page: localStorage.getItem('@eConform-ClientName') || 'Início', link: '/client/dashboard' },
                { page: 'Empresas', link: companyId && '/client/companies' },
              ]}
            />
          )}

          {!!company?.cnaes && tabCompany && (
            <MainTab
              title={
                <>
                  <chakra.span color={company.enabled == 1 ? 'grayBlue.500' : 'red.500'}>{company.name}</chakra.span>
                  {!company.enabled == 1 && <Badge colorScheme="red">Inativo</Badge>}
                  {company?.cnaes.lowLevel?.length > 0 && (
                    <Icon as={MdSignalCellular1Bar} color="green.400" w={4} h={4} ms="2" title="Risco Baixo" />
                  )}
                  {company?.cnaes.mediumLevel?.length > 0 && (
                    <Icon as={MdSignalCellular3Bar} color="yellow.400" w={4} h={4} ms="2" title="Risco médio" />
                  )}
                  {company?.cnaes.highLevel?.length > 0 && (
                    <Icon as={MdSignalCellular4Bar} color="red.400" w={4} h={4} ms="2" title="Risco Alto" />
                  )}
                  {daysDistance(new Date(company.createdAt?.date), 30) && (
                    <Badge colorScheme="purple" ms="2">
                      Novo
                    </Badge>
                  )}
                </>
              }
              subtitle={
                <HStack>
                  <Text fontSize="xs" color="grayBlue.500">
                    Enquadramento do CNPJ:{' '}
                  </Text>
                  <Menu>
                    <MenuButton
                      as={Button}
                      size="xs"
                      rightIcon={<HiChevronDown />}
                      color="white"
                      textTransform="capitalize"
                      bg={
                        searchParams.get('cnae_level') === '"low_level"'
                          ? 'green.500'
                          : searchParams.get('cnae_level') === '"medium_level"'
                          ? 'yellow.500'
                          : searchParams.get('cnae_level') === '"high_level"'
                          ? 'red.500'
                          : 'grayBlue.500'
                      }
                      _hover={{
                        bg:
                          searchParams.get('cnae_level') === '"low_level"'
                            ? 'green.400'
                            : searchParams.get('cnae_level') === '"medium_level"'
                            ? 'yellow.400'
                            : searchParams.get('cnae_level') === '"high_level"'
                            ? 'red.400'
                            : 'grayBlue.400',
                      }}
                      _active={{
                        bg:
                          searchParams.get('cnae_level') === '"low_level"'
                            ? 'green.400'
                            : searchParams.get('cnae_level') === '"medium_level"'
                            ? 'yellow.400'
                            : searchParams.get('cnae_level') === '"high_level"'
                            ? 'red.400'
                            : 'grayBlue.400',
                      }}
                    >
                      {searchParams.get('cnae_level') === '"low_level"'
                        ? 'Risco Baixo'
                        : searchParams.get('cnae_level') === '"medium_level"'
                        ? 'Risco Médio'
                        : searchParams.get('cnae_level') === '"high_level"'
                        ? 'Risco Alto'
                        : 'Não possui licenças'}
                    </MenuButton>
                    <MenuList fontSize="xs" color="white">
                      <MenuItem
                        as={LinkRouterDom}
                        to={`/client/companies/${companyId}/panel?cnae_level="low_level"`}
                        onClick={() => setCnaeLevel('"low_level"')}
                        bg={company.cnaes?.lowLevel.length > 0 ? 'green.500' : 'green.300'}
                        _hover={{ bg: 'green.400' }}
                        _focus={{ bg: 'green.500' }}
                        isDisabled={!company.cnaes?.lowLevel.length > 0}
                      >
                        Risco Baixo
                      </MenuItem>
                      <MenuItem
                        as={LinkRouterDom}
                        to={`/client/companies/${companyId}/panel?cnae_level="medium_level"`}
                        onClick={() => setCnaeLevel('"medium_level"')}
                        bg={company.cnaes?.mediumLevel.length > 0 ? 'yellow.500' : 'yellow.300'}
                        _hover={{ bg: 'yellow.400' }}
                        _focus={{ bg: 'yellow.500' }}
                        isDisabled={!company.cnaes?.mediumLevel.length > 0}
                      >
                        Risco Médio
                      </MenuItem>
                      <MenuItem
                        as={LinkRouterDom}
                        to={`/client/companies/${companyId}/panel?cnae_level="high_level"`}
                        onClick={() => setCnaeLevel('"high_level"')}
                        bg={company.cnaes?.highLevel.length > 0 ? 'red.500' : 'red.300'}
                        _hover={{ bg: 'red.400' }}
                        _focus={{ bg: 'red.500' }}
                        isDisabled={!company.cnaes?.highLevel.length > 0}
                      >
                        Risco Alto
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              }
              tabitem={[
                {
                  title: (
                    <>
                      <MdDashboard /> Painel
                    </>
                  ),
                  link: `/client/companies/${companyId}/panel${
                    searchParams.get('cnae_level') ? `?cnae_level=${searchParams.get('cnae_level')}` : ''
                  }`,
                  active: tabCompany == 'panel' ? true : false,
                  disabled: false,
                },
                {
                  title: (
                    <>
                      <MdAccountBalance /> Dados
                    </>
                  ),
                  link: `/client/companies/${companyId}/data${
                    searchParams.get('cnae_level') ? `?cnae_level=${searchParams.get('cnae_level')}` : ''
                  }`,
                  active: tabCompany == 'data' ? true : false,
                  disabled: !partnerCan && !getCompanyCan,
                },
                {
                  title: (
                    <>
                      <MdAccountBalance /> CNPJs
                    </>
                  ),
                  link: `/client/companies/${companyId}/cnpjs${
                    searchParams.get('cnae_level') ? `?cnae_level=${searchParams.get('cnae_level')}` : ''
                  }`,
                  active: tabCompany == 'cnpjs' ? true : false,
                  disabled: !getCNPJCan,
                },
                {
                  title: (
                    <>
                      <RiFilePaper2Line /> Licenças
                    </>
                  ),
                  link: `/client/companies/${companyId}/licenses${
                    searchParams.get('cnae_level') ? `?cnae_level=${searchParams.get('cnae_level')}` : ''
                  }`,
                  active: tabCompany == 'licenses' ? true : false,
                  disabled: !getLicensesCan,
                },
                {
                  title: (
                    <>
                      <MdLibraryBooks /> Documentos
                    </>
                  ),
                  link: `/client/companies/${companyId}/documents${
                    searchParams.get('cnae_level') ? `?cnae_level=${searchParams.get('cnae_level')}` : ''
                  }`,
                  active: tabCompany == 'documents' ? true : false,
                  disabled: !getFilesCan,
                },
              ]}
            />
          )}
          <Outlet />
        </ContentPage>
        <Footer />
      </Page>
    </Main>
  );
}
