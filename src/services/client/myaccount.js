import api from 'services/api';

const readItem = (args) => {
  return api.get(`/api/v1/client/myaccount/profile?_locale=pt_br&${args}`);
};

const updateItem = (data, args) => {
  return api.put(`/api/v1/client/myaccount/profile?_locale=pt_br&${args}`, data);
};

const deleteItem = (args) => {
  return api.delete(`/api/v1/client/myaccount/profile?_locale=pt_br&${args}`);
};

export default {
  readItem,
  updateItem,
  deleteItem,
};
