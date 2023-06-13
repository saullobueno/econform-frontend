import React from 'react';
import { Text } from '@chakra-ui/react';

export default function ShowingItemsLegend({ total, page, limit }) {
  const firstItem = Number(page) * Number(limit);
  const lastItem =
    Number(total) > Number(limit) && Number(total) > Number(page) * Number(limit) + Number(limit)
      ? Number(page) * Number(limit) + Number(limit)
      : total;

  return (
    Number(total) > 0 && (
      <Text fontSize="sm" color="grayBlue.400">
        Mostrando <strong>{firstItem}</strong> a <strong> {lastItem} </strong> de <strong>{total}</strong>
      </Text>
    )
  );
}
