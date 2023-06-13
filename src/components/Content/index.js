import React from 'react';
import { Text, Box, Stack, VStack, Heading, Skeleton } from '@chakra-ui/react';
import { Loading } from 'components/Loading';

export function Main({ children, ...props }) {
  return (
    <Box w="100%" h="100%" {...props}>
      {children}
    </Box>
  );
}

export function Page({ sidebarCompact, children, ...props }) {
  return (
    <VStack w="100%" h="100%" p={{ base: '0 1rem 3rem 1rem', lg: '0 2rem 2rem 300px' }} {...props}>
      {children}
    </VStack>
  );
}

export function ContentPage({ children, ...props }) {
  return (
    <Box w="100%" {...props}>
      {children}
    </Box>
  );
}

export function Content({ children, ...props }) {
  return (
    <Stack
      direction={{ base: 'column', md: 'row', lg: 'column', xl: 'row' }}
      align="stretch"
      paddingBottom="8"
      spacing="8"
      {...props}
    >
      {children}
    </Stack>
  );
}

export function Paper({
  fluid = false,
  transparent = false,
  title = '',
  justify = 'space-between',
  sizeTitle = 'lg',
  loading = false,
  isSubmitting = false,
  options = '',
  children = {},
  padding = '8',
  ...props
}) {
  return (
    <Box
      w={!fluid ? { base: '100%', md: '50%', lg: '100%', xl: '50%' } : '100%'}
      bgColor={!transparent ? 'white' : 'transparent'}
      h="100%"
      {...props}
    >
      {(title || options) && (
        <Stack
          direction={['column', 'column', 'row']}
          justify={justify}
          alignItems="center"
          spacing="8"
          p={!transparent ? padding : `0 0 ${padding} 0`}
          borderBottom="1px"
          borderColor="grayBlue.100"
        >
          {title && (
            <Heading
              size={sizeTitle}
              fontWeight="semibold"
              color="grayBlue.500"
              minHeight="30px"
              display="flex"
              align="center"
            >
              {title} {(loading || isSubmitting) && <Loading display="inline-block" w="auto" size="md" py="0" ml="4" />}
            </Heading>
          )}
          {options && options}
        </Stack>
      )}
      {loading && !isSubmitting ? (
        <Box p={!transparent ? padding : `${padding} 0 ${padding} 0`} opacity={loading ? '.2' : '1'}>
          <Stack>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        </Box>
      ) : (
        <Box p={!transparent ? padding : `${padding} 0 ${padding} 0`} opacity={loading ? '.2' : '1'}>
          {children}
        </Box>
      )}
    </Box>
  );
}

export function Card({ children, ...props }) {
  return (
    <Box h="100%" mb="4" {...props}>
      {children}
    </Box>
  );
}

export function Footer({ ...props }) {
  let date = new Date();
  return (
    <Text fontSize="xs" color="grayBlue.400" p="4" {...props}>
      © {date.getFullYear()} - eConform. Todos os direitos reservados.
    </Text>
  );
}
