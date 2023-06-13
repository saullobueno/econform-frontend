import React from 'react';
import { Link as LinkRouterDom } from 'react-router-dom';

import {
  Box,
  Stack,
  HStack,
  VStack,
  Heading,
  Text,
  Icon,
  Link,
  Image,
  Avatar,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import PrivateLink from 'components/PrivateLink';

import { FiUser, FiLogOut } from 'react-icons/fi';
import { BiSupport } from 'react-icons/bi';
import { RiArrowLeftLine } from 'react-icons/ri';

export function SidebarNav({ onClickLogout, ClientSupportPage, auth, routes }) {
  return (
    <>
      <Accordion w="100%" p="0" bg="blackAlpha.100" allowMultiple>
        <AccordionItem border="0" p="0" textAlign="left">
          <AccordionButton as={HStack} p={{ base: '4', lg: '8' }} justifyContent="space-between" cursor="pointer">
            <HStack spacing="3">
              <Avatar name={auth.name} bgColor="grayBlue.500" color="grayBlue.300" size="sm" />
              <VStack spacing="0" fontWeight="thin" align="start" wordBreak="break-word">
                <Text color="white" fontSize="sm" fontWeight="300">
                  {auth.name}
                </Text>
                <Text color="grayBlue.400" w="auto" fontSize="3xs">
                  {auth.email}
                </Text>
                <Text color="grayBlue.400" fontSize="3xs">
                  {auth.access_role === 'ECONFORM'
                    ? 'Administrador eConform '
                    : auth.access_role === 'PARTNER'
                    ? 'Parceiro'
                    : auth.access_role === 'ADMIN'
                    ? 'Administrador'
                    : auth.access_role === 'USER'
                    ? 'Utilizador'
                    : null}
                </Text>
              </VStack>
            </HStack>
            <AccordionIcon color="grayBlue.500" />
          </AccordionButton>
          <AccordionPanel px="4" pb="0">
            <PrivateLink
              label="Minha conta"
              role={auth.access_role}
              to={`/${
                auth.access_role === 'ECONFORM' || auth.access_role === 'PARTNER' ? 'admin' : 'client'
              }/myaccount`}
              display="block"
              borderRadius="2px"
              _hover={{ bg: 'blackAlpha.100', transition: '.3s', textDecoration: 'none' }}
              _focus={{ bg: 'blackAlpha.300', transition: '.3s', boxShadow: 'none' }}
              activeStyle={{
                bg: 'blackAlpha.200',
              }}
            >
              <HStack
                spacing="4"
                py="2"
                px="4"
                align="center"
                onClick={ClientSupportPage}
                _hover={{ color: 'grayBlue.300', transition: '.3s' }}
              >
                <Icon as={FiUser} color="grayBlue.500" />
                <Text fontSize="sm" color="white" fontWeight="thin">
                  Minha conta
                </Text>
              </HStack>
            </PrivateLink>
          </AccordionPanel>
          <AccordionPanel px="4" pt="0">
            <PrivateLink
              label="Sair"
              role={auth.access_role}
              onClick={onClickLogout}
              to="/"
              display="block"
              borderRadius="2px"
              _hover={{ bg: 'blackAlpha.100', transition: '.3s', textDecoration: 'none' }}
              _focus={{ bg: 'blackAlpha.300', transition: '.3s', boxShadow: 'none' }}
              activeStyle={{
                bg: 'blackAlpha.200',
              }}
            >
              <HStack spacing="4" py="2" px="4" align="center">
                <Icon as={FiLogOut} color="grayBlue.500" />
                <Text fontSize="sm" color="white" fontWeight="thin">
                  Sair
                </Text>
              </HStack>
            </PrivateLink>
          </AccordionPanel>
          {/* <AccordionPanel px="4" pb="0">
            <Box _hover={{ bg: 'rgba(255,255,255,.07)', borderRadius: '2px' }}>
              <Link as={LinkRouterDom} to="/client/support" _hover={{ textDecoration: 'none' }}>
                <HStack
                  spacing="4"
                  py="2"
                  px="4"
                  align="center"
                  onClick={ClientSupportPage}
                  _hover={{ color: 'grayBlue.300', transition: '.3s' }}
                >
                  <Icon as={BiSupport} color="grayBlue.500" />
                  <Text fontSize="sm" color="white" fontWeight="thin">
                    Suporte
                  </Text>
                </HStack>
              </Link>
            </Box>
          </AccordionPanel> */}
        </AccordionItem>
      </Accordion>

      <VStack w="100%" p={{ base: '4', lg: '8' }} spacing="8" align="stretch">
        {routes?.map((categoryItem, i) => (
          <VStack key={i} spacing="3" align="stretch">
            {auth?.isAuth && categoryItem.role?.includes(auth.access_role) && (
              <>
                <Heading as="h1" fontSize="xs" fontWeight="medium" color="grayBlue.700" textTransform="uppercase">
                  {categoryItem?.category}
                </Heading>
                {categoryItem?.items.map((itemNav, ii) => (
                  <PrivateLink
                    key={ii}
                    align="center"
                    label={itemNav.name}
                    role={itemNav.role}
                    to={categoryItem.path + itemNav.path}
                    display="block"
                    borderRadius="2px"
                    _hover={{ bg: 'blackAlpha.100', transition: '.3s' }}
                    _focus={{ bg: 'blackAlpha.300', transition: '.3s', boxShadow: 'none' }}
                    activeStyle={{
                      background: 'rgba(0, 0, 0, 0.09)',
                    }}
                  >
                    <HStack spacing="4" py="2" px="4" align="center">
                      <Icon as={itemNav.icon} color="grayBlue.400" />
                      <Text fontSize="sm" color="white" fontWeight="thin">
                        {itemNav.name}
                      </Text>
                    </HStack>
                  </PrivateLink>
                ))}
              </>
            )}
          </VStack>
        ))}
      </VStack>
    </>
  );
}
