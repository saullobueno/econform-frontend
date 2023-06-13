import api from 'services/api';

const signIn = (data) => {
  return api.post(`/api/v1/system/user/login`, data);
};

const signToken = (token) => {
  return api.get(`/api/v1/system/user/login`, { 'X-AUTH-TOKEN': token });
};

const signUp = (values) => {
  return api.post(`/api/v1/client`, values);
};

export default {
  signIn,
  signToken,
  signUp,
};
