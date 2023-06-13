import api from 'services/api';

const timestamp = new Date().getTime();

const index = (args) => {
  return api.get(`/api/v1/admin/cnae/?_locale=pt_br&timestamp=${timestamp}${args}`);
};

const createItem = (data) => {
  return api.post(`/api/v1/admin/cnae/`, data);
};

const readItem = (id) => {
  return api.get(`/api/v1/admin/cnae/${id}`);
};

const updateItem = (id, data) => {
  return api.put(`/api/v1/admin/cnae/${id}`, data);
};

const deleteItem = (id) => {
  return api.delete(`/api/v1/admin/cnae/${id}`);
};

export default {
  index,
  createItem,
  readItem,
  updateItem,
  deleteItem,
};
