import React from 'react';
import { Select as ChakraSelect, ChakraStylesConfig } from 'chakra-react-select';
import { useController } from 'react-hook-form';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '@chakra-ui/react';

const Select = ({
  name = '',
  label = '',
  value,
  variant = 'filled',
  control,
  onChange,
  ref,
  isMulti = true,
  selectAllOption = false,
  options = [],
  isClearable = true,
  closeMenuOnSelect = false,
  placeholder = 'Selecione ou digite para buscar...',
  noOptionsMessage = () => 'Nenhuma opção encontrada',
  loadingMessage = () => 'Carregando',
  errors,
  helper,
  ...props
}) => {
  const chakraStyles: ChakraStylesConfig = {
    control: (provided) => ({
      ...provided,
      border: 0,
      ps: 0,
      pe: 0,
      minHeight: '40px',
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: 'grayBlue.50',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0.5rem',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      fontSize: 'xs',
      fontWeight: 'normal',
    }),
    option: (provided) => ({
      ...provided,
      fontSize: 'xs',
    }),
  };

  options = selectAllOption && isMulti ? [{ value: 'all', label: 'Selecionar todos' }, ...options] : options;

  const ChakraSelectComponent = (props) => {
    return (
      <FormControl isInvalid={errors && errors[name]}>
        {!!label && <FormLabel>{label}</FormLabel>}

        <ChakraSelect
          variant={variant}
          options={options}
          onChange={(selected) => {
            selectAllOption && isMulti && selected?.length > 0 && selected.find((option) => option.value === 'all')
              ? onChange(options.slice(1))
              : !isMulti
              ? onChange((selected && selected.value) || null)
              : onChange(selected);
          }}
          isMulti={isMulti}
          isClearable={isClearable}
          closeMenuOnSelect={closeMenuOnSelect}
          noOptionsMessage={noOptionsMessage}
          loadingMessage={loadingMessage}
          value={value}
          chakraStyles={chakraStyles}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />

        {helper && <FormHelperText>{helper}</FormHelperText>}
        {errors && errors[name] && <FormErrorMessage>{errors[name].message}</FormErrorMessage>}
      </FormControl>
    );
  };

  if (control) {
    const {
      field: { onChange, value, ref },
      fieldState: { error },
    } = useController({
      name,
      control,
    });
    return <ChakraSelectComponent {...props} />;
  }

  return <ChakraSelectComponent {...props} />;
};

export { Select };
