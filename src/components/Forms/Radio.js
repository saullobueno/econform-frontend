import React, { forwardRef } from 'react';
import {
  chakra,
  Radio as ChakraRadio,
  Text,
  HStack,
  RadioGroup,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  SimpleGrid,
} from '@chakra-ui/react';

export const Radio = ({
  name = '',
  label = '',
  columns = [1],
  minChildWidth,
  options = [],
  getValues,
  defaultValue = '',
  register,
  errors,
  helper,
  ...rest
}) => {
  return (
    <>
      <FormControl>
        <FormLabel mb="1">{label}</FormLabel>
        <RadioGroup defaultValue={!!getValues ? getValues(name) : defaultValue}>
          <SimpleGrid columns={columns} minChildWidth={minChildWidth} spacing={2}>
            {options?.map((option, i) => (
              <ChakraRadio key={i} value={option.value} onClick={option.onClick} {...register(name)} {...rest}>
                <chakra.span onClick={option.onClick}>{option.label}</chakra.span>
              </ChakraRadio>
            ))}
          </SimpleGrid>
          {helper && <FormHelperText>{helper}</FormHelperText>}
          {errors[name] && <FormErrorMessage>{errors[name].message}</FormErrorMessage>}
        </RadioGroup>
      </FormControl>
    </>
  );
};
