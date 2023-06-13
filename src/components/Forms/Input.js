import React, { forwardRef } from 'react';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input as ChakraInput } from '@chakra-ui/react';
import InputMask from 'react-input-mask';

const InputBase = (
  {
    name = '',
    type = 'text',
    label = '',
    variant = 'filled',
    placeholder,
    darkMode = false,
    register = () => {},
    mask = '',
    formatchars = { 9: '[0-9]', '#': '[A-Za-z]', '*': '[A-Za-z0-9]' },
    maskchar = '',
    errors = {},
    helper = null,
    ...rest
  },
  ref
) => {
  return (
    <FormControl isInvalid={errors[name]}>
      {!!label && <FormLabel color={darkMode ? 'grayBlue.400' : 'grayBlue.500'}>{label}</FormLabel>}
      <ChakraInput
        as={!!mask && InputMask}
        type={type}
        variant={variant}
        placeholder={placeholder}
        mask={mask}
        formatchars={!!mask ? formatchars : null}
        maskchar={maskchar}
        ref={ref}
        {...register(name)}
        sx={{
          '&::-webkit-file-upload-button': {
            display: 'none',
          },
        }}
        {...rest}
      />
      {helper && <FormHelperText fontSize="xs">{helper}</FormHelperText>}
      {errors[name] && <FormErrorMessage fontSize="xs">{errors[name].message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
