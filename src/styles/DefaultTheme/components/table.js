export default {
  baseStyle: {
    thead: {
      tr: {
        th: {
          color: 'grayBlue.400',
          textTransform: 'uppercase',
          fontWeight: 'semibold',
          borderColor: 'grayBlue.100',
          '&::first-letter': {
            textTransform: 'uppercase',
          },
        },
      },
    },
    tbody: {
      tr: {
        td: {
          fontSize: 'xs',
          color: 'grayBlue.600',
          borderColor: 'grayBlue.100',
        },
      },
    },
  },
};
