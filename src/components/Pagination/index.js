import React from 'react';
import { chakra, HStack, Center, IconButton } from '@chakra-ui/react';

import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';

function Pagination({ page, handlePageChange = () => {}, pagesInRange = [] }) {
  return (
    <Center mt="8">
      <HStack spacing="2">
        <IconButton
          onClick={() => handlePageChange(page - 1)}
          isDisabled={page == 0 || pagesInRange.length <= 0}
          aria-label="Previous page"
          icon={<RiArrowLeftSLine />}
        />

        {page >= 5 && (
          <IconButton
            onClick={() => handlePageChange(0)}
            isDisabled={page == 0 || pagesInRange.length <= 0}
            aria-label="First page"
            icon={<>1</>}
          />
        )}

        {page >= 6 && (
          <chakra.span color="blue.400" fontSize="lg">
            ...
          </chakra.span>
        )}

        {pagesInRange.map(
          (pageInRange, i) =>
            pageInRange < page &&
            pageInRange > page - 5 && (
              <IconButton
                key={i}
                onClick={() => handlePageChange(pageInRange)}
                aria-label={`Page ${pageInRange - 1}`}
                icon={<>{pageInRange + 1}</>}
              />
            )
        )}

        {pagesInRange.map(
          (pageInRange, i) =>
            pageInRange == page && (
              <IconButton
                key={i}
                colorScheme={page == pageInRange && 'green'}
                onClick={() => handlePageChange(pageInRange)}
                isDisabled={page == pageInRange}
                aria-label={`Page ${pageInRange - 1}`}
                icon={<>{pageInRange + 1}</>}
              />
            )
        )}

        {pagesInRange.map(
          (pageInRange, i) =>
            pageInRange > page &&
            pageInRange < page + 5 && (
              <IconButton
                key={i}
                onClick={() => handlePageChange(pageInRange)}
                aria-label={`Page ${pageInRange - 1}`}
                icon={<>{pageInRange + 1}</>}
              />
            )
        )}

        {page <= pagesInRange[pagesInRange.length - 1] - 6 && (
          <chakra.span color="blue.400" fontSize="lg">
            ...
          </chakra.span>
        )}

        {page <= pagesInRange[pagesInRange.length - 1] - 5 && (
          <IconButton
            onClick={() => handlePageChange(pagesInRange.length - 1)}
            isDisabled={page >= pagesInRange.length - 1 || pagesInRange.length <= 0}
            aria-label="Previous page"
            icon={<>{pagesInRange[pagesInRange.length - 1] + 1}</>}
          />
        )}

        <IconButton
          onClick={() => handlePageChange(page + 1)}
          isDisabled={page >= pagesInRange.length - 1 || pagesInRange.length <= 0}
          aria-label="Previous page"
          icon={<RiArrowRightSLine />}
        />
      </HStack>
    </Center>
  );
}

export default Pagination;
