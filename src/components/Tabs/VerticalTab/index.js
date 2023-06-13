import React from 'react';
import { Link as LinkRouterDom } from 'react-router-dom';
import { Link, VStack, Box, Heading, Text } from '@chakra-ui/react';

export function VerticalTabLink({ tabitem, ...rest }) {
  return (
    <VStack bgColor="white" spacing="0" {...rest}>
      {tabitem.map((tab, i) => (
        <Link
          key={i}
          as={LinkRouterDom}
          to={!tab.disabled && tab.link}
          display="block"
          p="1rem 2rem"
          color={tab.active ? 'grayBlue.600' : tab.disabled ? 'grayBlue.300' : 'blue.400'}
          borderRightColor={tab.active && !tab.disabled ? 'blue.400' : 'white'}
          borderRightWidth="1px"
          cursor={tab.disabled && 'no-drop'}
          _hover={{ textDecoration: (!tab.disabled || !tab.active) && 'underline' }}
        >
          <Heading as="h3" size="sm" fontWeight="medium" color={tab.active && !tab.disabled && 'grayBlue.600'}>
            {tab.title}
          </Heading>
          <Text fontSize="0.65rem" fontWeight="normal" color={!tab.disabled ? 'grayBlue.500' : 'grayBlue.300'}>
            {tab.subtitle}
          </Text>
        </Link>
      ))}
    </VStack>
  );
}
