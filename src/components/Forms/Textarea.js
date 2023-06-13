import React, { forwardRef } from 'react';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Textarea as TextareaChakra } from '@chakra-ui/react';

const TextareaBase = (
  { name = '', label = '', placeholder = '', register = () => {}, errors = {}, helper = null, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={errors[name]} {...rest}>
      {!!label && <FormLabel>{label}</FormLabel>}
      <TextareaChakra placeholder={placeholder} ref={ref} {...register(name)} />
      {helper && <FormHelperText>{helper}</FormHelperText>}
      {errors[name] && <FormErrorMessage>{errors[name].message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Textarea = forwardRef(TextareaBase);
