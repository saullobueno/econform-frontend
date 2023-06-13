import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Text, Heading, VStack, Button } from '@chakra-ui/react';

import { RiArrowLeftSLine, RiCheckLine } from 'react-icons/ri';

export default function Logos() {
  let navigate = useNavigate();
  return (
    <VStack w={{ base: '100%', sm: '270px' }} spacing="1rem" align="center" textAlign="center">
      <RiCheckLine style={{ margin: '0 auto', width: '7rem', height: '7rem' }} color="white" />
      <Heading as="h3" color="white" size="lg" fontWeight="semibold">
        Cadastro realizado!
      </Heading>
      <Heading as="h5" color="white" size="sm" fontWeight="semibold" pb="1rem">
        Plataforma em atualização
      </Heading>

      <Text color="white" fontSize="sm" fontWeight="thin">
        O cadastro foi realizado, porém, a plataforma eConform entrou em uma fase de atualização. Novos recursos estão
        sendo implementados e atualizados.
      </Text>

      <Text color="white" fontSize="sm" fontWeight="thin">
        Em breve você receberá uma notificação para voltar e acessar. Aguarde.
      </Text>

      <Button leftIcon={<RiArrowLeftSLine />} color="white" variant="link" mt="1rem" onClick={() => navigate(-1)}>
        Voltar
      </Button>
    </VStack>
  );
}
