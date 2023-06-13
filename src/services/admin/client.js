import api from 'services/api';

const timestamp = new Date().getTime();

const index = (args) => {
  return api.get(`/api/v1/admin/client/?_locale=pt_br&timestamp=${timestamp}${args}`);
};

const createItem = (data) => {
  return api.post(`/api/v1/admin/client/`, data);
};

const readItem = (id) => {
  return api.get(`/api/v1/admin/client/${id}`);
};

const updateItem = (id, data) => {
  return api.put(`/api/v1/admin/client/${id}`, data);
};

const deleteItem = (id) => {
  return api.delete(`/api/v1/admin/client/${id}`);
};

const managerItem = (id) => {
  return api.post(`/api/v1/admin/client/manager/${id}`);
};

export default {
  index,
  createItem,
  readItem,
  updateItem,
  deleteItem,
  managerItem,
};
