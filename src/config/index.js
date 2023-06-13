const Config = {
  VERSION: process.env.REACT_APP_ECONFORM_VERSION,
  ECONFORM: {
    /* baseUri: 'https://services.econform.com.br', */
    baseUri: process.env.REACT_APP_ECONFORM_BASE_URI,
  },
};
export default Config;
