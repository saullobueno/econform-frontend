import React from 'react';
import { Center, Heading, Icon, Text, VStack } from '@chakra-ui/react';

function Result({ icon, title = '', description = '', options }) {
  return (
    <Center p="16">
      <VStack>
        {icon && <Icon as={icon} w={16} h={16} color="blue.400" />}
        {title && (
          <Heading as="h1" size="md" color="grayBlue.600">
            {title}
          </Heading>
        )}
        {description && <Text color="grayBlue.600">{description}</Text>}
        {options && options}
      </VStack>
    </Center>
  );
}

export default Result;
