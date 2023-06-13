import React from 'react';
import { Box, Text, HStack, Select } from '@chakra-ui/react';

export default function ItemsPerPage({ total, limit, handlePerRowsChange }) {
  return (
    Number(total) > 0 && (
      <HStack>
        <Text fontSize="sm" color="grayBlue.400">
          Items por página:{' '}
        </Text>
        <Box>
          <Select variant="unstyled" size="sm" color="blue.400" value={limit} onChange={handlePerRowsChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={60}>60</option>
            <option value={80}>80</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
          </Select>
        </Box>
      </HStack>
    )
  );
}
