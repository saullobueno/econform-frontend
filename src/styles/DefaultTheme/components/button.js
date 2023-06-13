export default {
  baseStyle: {
    fontWeight: 'medium',
    textTransform: 'uppercase',
    borderRadius: '2px',
    transition: '0.3s',
    boxShadow: 'none',
  },
  sizes: {
    md: {
      h: '40px',
      fontSize: 'sm',
    },
  },
  variants: {
    solid: {
      _focus: {
        boxShadow: 'none',
      },
    },
    outline: {
      _focus: {
        boxShadow: 'none',
      },
    },
    ghost: {
      _focus: {
        boxShadow: 'none',
      },
    },
  },
  defaultProps: {
    colorScheme: 'blue',
    variant: 'solid',
    size: 'md',
  },
};
