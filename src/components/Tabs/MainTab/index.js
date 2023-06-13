import React from 'react';
import { Link as LinkRouterDom } from 'react-router-dom';
import { Box, Stack, Flex, Link, Heading, HStack, Wrap, WrapItem, VStack } from '@chakra-ui/react';

export default function MainTab({ title, subtitle = '', options = '', tabitem, ...rest }) {
  return (
    <Stack
      direction={{ base: 'column', xl: 'row' }}
      bgColor="white"
      justify="space-between"
      align={{ base: 'start', xl: 'center' }}
      mb="8"
      p="8"
      spacing={{ base: '2', '2xl': '8' }}
      {...rest}
    >
      <VStack align="left">
        <Heading
          size="lg"
          minW="250px"
          fontWeight="semibold"
          textTransform="capitalize"
          color="grayBlue.500"
          pb={{ base: '2', lg: '0' }}
        >
          {typeof title === 'string' ? title?.toLowerCase() : title}
        </Heading>
        {subtitle && <Box>{subtitle}</Box>}
      </VStack>
      {options && <Box>{options}</Box>}
      <Wrap justify="start" align="center" spacing={{ base: '2', '3xl': '8' }} mr={{ lg: '8' }}>
        {tabitem.map((tab, i) => (
          <WrapItem key={i}>
            <Link
              as={LinkRouterDom}
              to={tab.disabled ? '#' : tab.link}
              color={tab.active ? 'grayBlue.500' : tab.disabled ? 'grayBlue.300' : 'blue.400'}
              p={{ base: '2', '3xl': '4' }}
              borderRadius="3px"
              fontSize="sm"
              fontWeight={tab.active ? 'semi-bold' : ''}
              cursor={tab.disabled && 'no-drop'}
              _hover={{
                textDecoration: tab.active ? 'none' : 'underline',
              }}
            >
              <HStack
                spacing="2"
                sx={{
                  svg: {
                    display: 'none',
                  },
                }}
              >
                {tab.title}
              </HStack>
            </Link>
          </WrapItem>
        ))}
      </Wrap>
    </Stack>
  );
}
