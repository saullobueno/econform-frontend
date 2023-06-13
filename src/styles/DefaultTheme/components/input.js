const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-30px) translateX(-20px)',
};

export default {
  baseStyle: {
    field: {
      border: '0',
      borderRadius: '3px',
      padding: '.5rem 1rem',
    },
  },
  variants: {
    filled: {
      field: {
        height: 'auto',
        bg: 'grayBlue.100',
        '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
          boxShadow: '0 0 0px 1000px #f8f9fc inset',
          border: '0',
        },
        _hover: {
          bg: 'grayBlue.200',
          '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
            boxShadow: '0 0 0px 1000px #f0f3f8 inset',
            border: '0',
          },
        },
        _focus: {
          bg: 'grayBlue.100',
        },
      },
    },
    floating: {
      container: {
        mt: '6',
        _focusWithin: {
          label: {
            ...activeLabelStyles,
          },
        },
        'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label': {
          ...activeLabelStyles,
        },
        label: {
          top: 0,
          left: 0,
          zIndex: 2,
          position: 'absolute',
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          mx: 3,
          px: 1,
          my: 2,
          transformOrigin: 'left top',
        },
      },
    },
  },
  defaultProps: {
    size: 'sm',
    variant: 'filled',
  },
};
