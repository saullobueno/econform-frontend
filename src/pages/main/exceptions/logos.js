import React from 'react';
import { useNavigate, Link as LinkDOM } from 'react-router-dom';

import { Link, Icon, Text, Box, Heading, chakra, Image, SimpleGrid } from '@chakra-ui/react';

import { RiArrowLeftSLine } from 'react-icons/ri';

import LogoOriginal from 'resources/logo/official/econform-logo-OriginalComFundoBranco.jpg';
import LogoEmFundoTransparente from 'resources/logo/official/econform-logo-OriginalComFundoTransparente.png';
import LogoEmPreto from 'resources/logo/official/econform-logo-EmPreto.png';
import LogoEmPretoEBranco from 'resources/logo/official/econform-logo-EmPretoEBranco.png';
import LogoEmBranco from 'resources/logo/official/econform-logo-EmBranco.png';
import LogoEmVerde from 'resources/logo/official/econform-logo-EmVerde.png';

export default function Logos() {
  let navigate = useNavigate();
  return (
    <>
      <Heading size="lg" color="white" mb="2">
        Logos eConform:
      </Heading>

      <Link as={LinkDOM} to="" fontSize="sm" onClick={() => navigate(-1)} color="white">
        <Icon as={RiArrowLeftSLine} /> Voltar
      </Link>

      <Box mt="8">
        <SimpleGrid color="white" spacing="8">
          <Box>
            <Text fontSize="xs">
              Original <chakra.small>(com Fundo Transparente)</chakra.small>{' '}
            </Text>
            <Image
              src={LogoEmFundoTransparente}
              w="200px"
              h="auto"
              bg="whiteAlpha.300"
              p="4"
              rounded="sm"
              alt="Logo eConform com Fundo Transparente"
            />
          </Box>

          <Box>
            <Text fontSize="xs">
              Original <chakra.small>(com Fundo Branco)</chakra.small>
            </Text>
            <Image
              src={LogoOriginal}
              w="200px"
              h="auto"
              bg="whiteAlpha.300"
              p="4"
              rounded="sm"
              alt="Logo eConform Original com Fundo Branco"
            />
          </Box>

          <Box>
            <Text fontSize="xs">
              Preto <chakra.small>(com Fundo Transparente)</chakra.small>
            </Text>
            <Image
              src={LogoEmPreto}
              w="200px"
              h="auto"
              bg="whiteAlpha.300"
              p="4"
              rounded="sm"
              alt="Logo eConform em Preto"
            />
          </Box>

          <Box>
            <Text fontSize="xs">
              Preto e branco <chakra.small>(com Fundo Transparente)</chakra.small>
            </Text>
            <Image
              src={LogoEmPretoEBranco}
              w="200px"
              h="auto"
              bg="whiteAlpha.300"
              p="4"
              rounded="sm"
              alt="Logo eConform em Preto e Branco"
            />
          </Box>

          <Box>
            <Text fontSize="xs">
              Branco <chakra.small>(com Fundo Transparente)</chakra.small>
            </Text>
            <Image
              src={LogoEmBranco}
              w="200px"
              h="auto"
              bg="whiteAlpha.300"
              p="4"
              rounded="sm"
              alt="Logo eConform em branco"
            />
          </Box>

          <Box>
            <Text fontSize="xs">
              Verde <chakra.small>(com Fundo Transparente)</chakra.small>
            </Text>
            <Image
              src={LogoEmVerde}
              w="200px"
              h="auto"
              bg="whiteAlpha.300"
              p="4"
              rounded="sm"
              alt="Logo eConform em Verde"
            />
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
}
