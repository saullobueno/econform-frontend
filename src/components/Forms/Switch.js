import React, { forwardRef } from 'react';
import {
  Switch as ChakraSwitch,
  HStack,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/react';

export const Switch = ({
  name = '',
  label = '',
  defaultChecked,
  value,
  getValues,
  register,
  errors,
  helper,
  ...rest
}) => (
  <>
    <FormControl>
      <HStack>
        <FormLabel mb="1">{label}</FormLabel>
        <ChakraSwitch
          defaultChecked={
            !!getValues
              ? Array.isArray(getValues(name))
                ? getValues(name).includes(String(value))
                : getValues(name) == value
              : !!defaultChecked
          }
          {...register(name)}
          {...rest}
        />{' '}
      </HStack>
      {helper && <FormHelperText>{helper}</FormHelperText>}
      {errors[name] && <FormErrorMessage>{errors[name].message}</FormErrorMessage>}
    </FormControl>
  </>
);
