import React from 'react';
import { Spinner, Center, VisuallyHidden, Flex } from '@chakra-ui/react';

export function Loading({
  show = true,
  width = '100%',
  py = '16',
  thickness = '2px',
  speed = '0.4s',
  emptyColor = 'blackAlpha.100',
  color = 'blue.400',
  size = 'xl',
  ...rest
}) {
  return (
    show && (
      <Center w={width} py={py} {...rest}>
        <Spinner thickness={thickness} speed={speed} emptyColor={emptyColor} color={color} size={size} />
        <VisuallyHidden>Carregando...</VisuallyHidden>
      </Center>
    )
  );
}

export function LoadingFull({
  show = true,
  position = 'center',
  thickness = '2px',
  speed = '0.4s',
  emptyColor = 'gray.100',
  color = 'blue.400',
  size = 'xl',
  ...rest
}) {
  return (
    show && (
      <Flex
        position="absolute"
        justify="center"
        alignItems={position === 'start' ? 'start' : 'center'}
        zIndex="100"
        width="100%"
        height="100%"
        backgroundColor="whiteAlpha.700"
        {...rest}
      >
        <Spinner thickness={thickness} speed={speed} emptyColor={emptyColor} color={color} size={size} role="status" />
        <VisuallyHidden>Carregando...</VisuallyHidden>
      </Flex>
    )
  );
}
