import axios from 'axios';
import { createStandaloneToast } from '@chakra-ui/react';

const api = axios.create({
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  baseURL: process.env.REACT_APP_ECONFORM_BASE_URI,
});

/**
 * @param {import('navigate').Navigate} navigate - from useNavigate() hook
 * @param {import('signOut').AuthContext} signOut; - from useAuth() hook
 */
export const setupInterceptors = (navigate, signOut) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@eConform.token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      console.warn('ERRO: ', error.response.data);
      return Promise.reject(error);
    }
  );
};

export default api;
