import React from 'react';
import { useLocation } from 'react-router-dom';

import {
  Box,
  HStack,
  VStack,
  Icon,
  Link,
  Image,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  useDisclosure,
  Center,
  Text,
} from '@chakra-ui/react';

import Logo from 'resources/logo/logo-white.svg';

import { SidebarNav } from './SidebarNav';
import PrivateLink from 'components/PrivateLink';

import { HiMenu } from 'react-icons/hi';
import { CgClose } from 'react-icons/cg';
import { RiArrowLeftLine } from 'react-icons/ri';

export default function SideBar({ auth, links, routes, onClickLogout }) {
  const isWideVersion = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onOpen, onClose } = useDisclosure();
  let location = useLocation();
  const sideAuth = location.pathname.split('/')[1];

  return (
    <VStack
      as="aside"
      w={isWideVersion ? '270px' : '100%'}
      height={isWideVersion ? '100%' : 'auto'}
      display="block"
      spacing="0"
      bg="#456fa1"
      position="fixed"
      overflowY="auto"
      zIndex={1000}
      sx={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'blue.700',
          borderRadius: '5px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'blue.400',
        },
      }}
    >
      <HStack
        minH={{ base: '50px', lg: '70px' }}
        px={{ base: '4', lg: '8' }}
        bg="#79a768"
        justify={isWideVersion ? 'center' : 'space-between'}
      >
        <VStack spacing="1">
          <Image src={Logo} w="150px" h="auto" alt="eConform" />
          {sideAuth === 'client' &&
            isWideVersion &&
            (auth.access_role === 'ECONFORM' || auth.access_role === 'PARTNER') && (
              <PrivateLink
                label={auth.name}
                role={auth.access_role}
                to="../admin"
                display="block"
                align="stretch"
                py="1"
                px="4"
                bg="blackAlpha.200"
                borderRadius="3px"
                onClick={() => localStorage.removeItem('@eConform-ClientName')}
                _hover={{ bg: 'blackAlpha.300', transition: '.3s' }}
                _focus={{ bg: 'blackAlpha.200', transition: '.3s', boxShadow: 'none' }}
                activeStyle={{
                  background: 'rgba(0,0,0,.09)',
                }}
              >
                <HStack spacing="2" align="center">
                  <Icon as={RiArrowLeftLine} color="grayBlue.400" />
                  <Text fontSize="2xs" color="white" fontWeight="thin">
                    Voltar à administração
                  </Text>
                </HStack>
              </PrivateLink>
            )}
        </VStack>
        {!isWideVersion && (
          <Link>
            <Icon
              as={HiMenu}
              boxSize={6}
              color="rgba(255,255,255,1)"
              _hover={{ color: 'rgba(255,255,255,.3)' }}
              onClick={onOpen}
            />
          </Link>
        )}
      </HStack>

      {isWideVersion ? (
        <SidebarNav onClickLogout={onClickLogout} auth={auth} routes={routes} />
      ) : (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="#456fa1" p="0">
            <DrawerCloseButton as={CgClose} color="white" />
            <DrawerHeader bg="#79a768" color="white" px="4" py="3">
              {sideAuth === 'client' && (auth.access_role === 'ECONFORM' || auth.access_role === 'PARTNER') ? (
                <PrivateLink
                  label={auth.name}
                  role={auth.access_role}
                  to="../admin"
                  align="stretch"
                  display="inline-block"
                  py="1"
                  px="4"
                  bg="blue.500"
                  borderRadius="md"
                  onClick={() => localStorage.removeItem('@eConform-ClientName')}
                  _hover={{ bg: 'blue.400', transition: '.3s' }}
                  _focus={{ bg: 'bllue.500', transition: '.3s', boxShadow: 'none' }}
                  activeStyle={{
                    background: 'rgba(0,0,0,.09)',
                  }}
                >
                  <HStack spacing="2" align="center">
                    <Icon as={RiArrowLeftLine} color="grayBlue.400" />
                    <Text fontSize="2xs" color="white" fontWeight="thin">
                      Voltar à administração
                    </Text>
                  </HStack>
                </PrivateLink>
              ) : (
                'Navegação'
              )}
            </DrawerHeader>

            <DrawerBody p="0">
              <SidebarNav onClickLogout={onClickLogout} auth={auth} routes={routes} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </VStack>
  );
}
