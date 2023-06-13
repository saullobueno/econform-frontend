import React from 'react';
import { useNavigate, Link as LinkDOM } from 'react-router-dom';
import { useAuth } from 'context/auth';

import { Box, Center, Heading, HStack, Icon, Link, Text, VStack } from '@chakra-ui/react';

import Breadcrumbs from 'components/Breadcrumbs';
import { Content, Paper } from 'components/Content';

import { RiArrowLeftSLine, RiArrowRightSLine, RiFileForbidFill } from 'react-icons/ri';

export default function MainExceptionAccessRestrictedPage() {
  const { signOut } = useAuth();
  let navigate = useNavigate();

  return (
    <>
      <Breadcrumbs
        title="Acesso restrito"
        pages={[{ page: localStorage.getItem('@eConform-ClientName') || 'Início', link: '/client/dashboard' }]}
      />

      <Content>
        <Paper fluid>
          <Center minH="calc(100vh - 230px)">
            <Box w={{ base: '100%', sm: '300px' }}>
              <VStack textAlign="center" spacing="12">
                <HStack align="center" justify="center" spacing="6">
                  <Icon as={RiFileForbidFill} w="7rem" h="7rem" color="#f7685b" />
                  <Heading as="h3" size="lg" textAlign="start" color="#f7685b">
                    Acesso restrito
                  </Heading>
                </HStack>

                <Text fontSize="sm">Você não tem permissão para entrar nesta página. Contate o administrador.</Text>

                <HStack w="100%" justify="space-between" fontSize="sm" color="blue.400">
                  <Link as={LinkDOM} to="#" onClick={() => navigate(-1)}>
                    <Icon as={RiArrowLeftSLine} /> Voltar
                  </Link>

                  <Link as={LinkDOM} to="#" onClick={signOut}>
                    Sair <Icon as={RiArrowRightSLine} />
                  </Link>
                </HStack>
              </VStack>
            </Box>
          </Center>
        </Paper>
      </Content>
    </>
  );
}
