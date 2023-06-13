import React, { forwardRef } from 'react';

import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  NumberInput as NumberInputChakra,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

const NumberInputBase = (
  { name = '', label = '', defaultValue = 0, min = 0, max = 100, step = 1, register, errors, helper },
  ref
) => {
  return (
    <FormControl isInvalid={errors[name]}>
      {!!label && <FormLabel>{label}</FormLabel>}
      <NumberInputChakra defaultValue={defaultValue} min={min} max={max} step={step} ref={ref}>
        <NumberInputField {...register(name)} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInputChakra>
      {helper && <FormHelperText>{helper}</FormHelperText>}
      {errors[name] && <FormErrorMessage>{errors[name].message}</FormErrorMessage>}
    </FormControl>
  );
};

export const NumberInput = forwardRef(NumberInputBase);
