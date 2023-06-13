import React from 'react';
import { Box, InputGroup, InputRightElement, Button, Icon, IconButton } from '@chakra-ui/react';

import { CgClose } from 'react-icons/cg';
import { RiSearchLine } from 'react-icons/ri';
import { Input } from 'components/Forms/Input';

function ButtonSearch({ loading = false, valueSearch, total, handleSearch, handleClearSearch, fetchData, ...rest }) {
  return (
    (valueSearch || Number(total) > 0) && (
      <Box {...rest}>
        <InputGroup>
          <InputGroup>
            <Input
              id="search"
              type="text"
              value={valueSearch}
              placeholder="Buscar"
              aria-label="Buscar"
              onKeyPress={handleSearch}
              onChange={handleSearch}
            />
            {valueSearch && (
              <InputRightElement height="100%">
                <Button
                  id="clearSearch"
                  type="button"
                  color="grayBlue.600"
                  bg="transparent"
                  size="sm"
                  onClick={handleClearSearch}
                  _hover={{ bg: 'transparent', color: 'blue.400' }}
                >
                  <Icon as={CgClose} />
                </Button>
              </InputRightElement>
            )}
          </InputGroup>
          <Button
            id="btnSearch"
            type="button"
            bg="grayBlue.300"
            height="auto"
            color="grayBlue.600"
            borderTopLeftRadius="none"
            borderBottomLeftRadius="none"
            _hover={{ bg: 'grayBlue.400' }}
            onClick={fetchData}
          >
            <Icon as={RiSearchLine} />
          </Button>
        </InputGroup>
      </Box>
    )
  );
}

export default ButtonSearch;
