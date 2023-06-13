import api from 'services/api';

const timestamp = new Date().getTime();

const index = (args) => {
  return api.get(`/api/v1/admin/user/?_locale=pt_br&timestamp=${timestamp}${args}`);
};

const createItem = (data) => {
  return api.post(`/api/v1/admin/user/`, data);
};

const readItem = (id) => {
  return api.get(`/api/v1/admin/user/${id}`);
};

const updateItem = (id, data) => {
  return api.patch(`/api/v1/admin/user/${id}`, data);
};

const deleteItem = (id) => {
  return api.delete(`/api/v1/admin/user/${id}`);
};

export default {
  index,
  createItem,
  readItem,
  updateItem,
  deleteItem,
};
