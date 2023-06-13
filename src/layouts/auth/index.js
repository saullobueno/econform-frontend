import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'context/auth';

import Logo from 'resources/logo/logo-white.svg';
import { Box, Center, Image, Flex, Text, Link, Stack, VStack } from '@chakra-ui/react';

export default function AuthLayout() {
  const { auth } = useAuth();
  let date = new Date();

  if (auth.isAuth) {
    if (auth.access_role === 'ECONFORM' || auth.access_role === 'PARTNER') {
      return <Navigate to="/admin/clients" replace={true} />;
    }
    return <Navigate to="/client/dashboard" replace={true} />;
  }

  return (
    <Center maxW="100vw" minH="100vh" bgGradient="radial(white 50%, #c2cfe0)">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        minW={{ base: '100%', lg: '900px', xl: '1100px' }}
        minH={{ base: '100vh', md: 'auto' }}
      >
        <Center bg="#79a768" w={{ base: '100%', md: '50%' }} h={{ base: '70px', md: 'auto' }} roundedLeft="sm">
          <Image
            src={Logo}
            width={{ base: '170px', md: '270px', lg: '320px', xl: '370px' }}
            height="auto"
            alt="eConform"
          />
        </Center>
        <VStack
          w={{ base: '100%', md: '50%' }}
          h={{ base: 'calc(100vh - 70px)', md: 'auto' }}
          bg="#456fa1"
          roundedRight="sm"
        >
          <Box flex={{ base: 'auto', md: 'none' }} p={{ base: '4', md: '12' }}>
            <Outlet />
          </Box>
          <Stack bg="#3e6491" w="100%" fontWeight="light" color="white" p="8" spacing="0">
            {/* <Link href="/" fontSize="xs">
              Termos de Uso
            </Link> */}
            <Text fontSize="2xs" textAlign="center">
              © {date.getFullYear()} - eConform. Todos os direitos reservados.
            </Text>
          </Stack>
        </VStack>
      </Flex>
    </Center>
  );
}
