import React, { useState } from 'react';
import { useNavigate, Link as LinkDOM } from 'react-router-dom';
import { useAuth } from 'context/auth';
import { useLoading } from 'context/loading';

import { AiFillFileExclamation } from 'react-icons/ai';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import { Box, Center, Button, Divider, Heading, HStack, Icon, Link, Text, VStack } from '@chakra-ui/react';

import Breadcrumbs from 'components/Breadcrumbs';
import { Content, Paper } from 'components/Content';

function NotFoundPage({ auth, signOut }) {
  let navigate = useNavigate();
  const [loading, setLoading] = useState();

  return (
    <Box w={{ base: '100%', sm: '300px' }} color={auth?.isAuth ? 'blue.400' : 'white'}>
      <VStack textAlign="start" spacing="12">
        <HStack align="center" justify="center" spacing="6">
          <Icon as={AiFillFileExclamation} w="7rem" h="7rem" />
          <Heading as="h3" size="lg" textAlign="start">
            Página não encontrada
          </Heading>
        </HStack>

        <Text fontSize="sm" color={auth?.isAuth ? 'grayBlue.700' : 'white'}>
          Confira o endereço ou tente acessar outra página.
        </Text>

        <HStack w="100%" justify="space-between" fontSize="sm">
          <Link as={LinkDOM} to="#" onClick={() => navigate(-1)}>
            <Icon as={RiArrowLeftSLine} /> Voltar
          </Link>
          {auth?.isAuth ? (
            <Link as={LinkDOM} to="#" onClick={signOut}>
              Sair <Icon as={RiArrowRightSLine} />
            </Link>
          ) : (
            <Link as={LinkDOM} to="/">
              Entrar <Icon as={RiArrowRightSLine} />
            </Link>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}

export default function MainExceptionNotFoundPage() {
  const { auth, signOut } = useAuth();

  return auth?.isAuth ? (
    <>
      <Breadcrumbs
        title="Página não encontrada"
        pages={[{ page: localStorage.getItem('@eConform-ClientName') || 'Início', link: '/client/dashboard' }]}
      />

      <Content>
        <Paper fluid>
          <Center minH="calc(100vh - 230px)">
            <NotFoundPage auth={auth} signOut={signOut} />
          </Center>
        </Paper>
      </Content>
    </>
  ) : (
    <NotFoundPage auth={auth} />
  );
}
