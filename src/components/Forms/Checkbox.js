import React, { forwardRef } from 'react';
import {
  Checkbox as ChakraCheckbox,
  Switch,
  HStack,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  SimpleGrid,
  chakra,
} from '@chakra-ui/react';

export const Checkbox = ({
  name = '',
  label = '',
  switchoption = false,
  options = [],
  defaultValue = [],
  getValues,
  columns = [1],
  register,
  errors,
  helper,
  ...rest
}) => (
  <>
    <FormControl>
      <FormLabel mb="1">{label}</FormLabel>
      <CheckboxGroup defaultValue={!!getValues ? getValues(name) : defaultValue}>
        <SimpleGrid columns={columns} spacing={2}>
          {options?.map((option, i) =>
            !switchoption ? (
              <ChakraCheckbox
                key={option.value}
                id={option.value}
                defaultChecked={
                  !!getValues
                    ? Array.isArray(getValues(name))
                      ? getValues(name).includes(String(option.value))
                      : getValues(name) == option.value
                    : !!option.defaultChecked
                }
                value={option.value}
                {...register(name)}
                {...rest}
              >
                {option.label}
              </ChakraCheckbox>
            ) : (
              <HStack key={option.value}>
                <chakra.span>{option.label}</chakra.span>
                <Switch
                  key={option.value}
                  id={option.value}
                  defaultChecked={
                    !!getValues
                      ? Array.isArray(getValues(name))
                        ? getValues(name).includes(String(option.value))
                        : getValues(name) == option.value
                      : !!option.defaultChecked
                  }
                  value={option.value}
                  {...register(name)}
                />{' '}
              </HStack>
            )
          )}
        </SimpleGrid>
      </CheckboxGroup>
      {helper && <FormHelperText>{helper}</FormHelperText>}
      {errors[name] && <FormErrorMessage>{errors[name].message}</FormErrorMessage>}
    </FormControl>
  </>
);
