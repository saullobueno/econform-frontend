import api from 'services/api';

const timestamp = new Date().getTime();

const index = (args) => {
  return api.get(`/api/v1/client/company/?_locale=pt_br&timestamp=${timestamp}${args}`);
};

const consultItem = (data) => {
  return api.post(`/api/v1/client/company/cnpj/cnae/level`, data);
};

const createItem = (data) => {
  return api.post(`/api/v1/client/company/cnpj`, data);
};

const importItem = (data) => {
  return api.post(`/api/v1/client/company/cnpj/file`, data);
};

const readItem = (companyId) => {
  return api.get(`/api/v1/client/company/${companyId}`);
};

const updateItem = (companyId, data) => {
  return api.put(`/api/v1/client/company/${companyId}`, data);
};

const deleteItem = (companyId) => {
  return api.delete(`/api/v1/client/company/delete/${companyId}`);
};

const licensesStatus = (companyId, args) => {
  return api.get(`/api/v1/client/company/${companyId}/license-status${args}`);
};

const logoCreateItem = (companyId, data) => {
  return api.post(`/api/v1/client/company/${companyId}/logo`, data);
};

const logoDeleteItem = (companyId) => {
  return api.delete(`/api/v1/client/company/${companyId}/logo`);
};

const cnpjIndex = (companyId, args) => {
  return api.get(`/api/v1/client/company/${companyId}/cnpj/?${args}`);
};

const cnpjCreateItem = (companyId, data) => {
  return api.post(`/api/v1/client/company/cnpj/${companyId}`, data);
};

const cnpjDeleteItem = (companyId, data) => {
  return api.delete(`/api/v1/client/company/${companyId}`, data);
};

const cnaeIndex = (companyId, args) => {
  return api.get(`/api/v1/client/company/${companyId}/cnae/search/?${args}`);
};

const licenseIndex = (companyId, args) => {
  return api.get(`/api/v1/client/company/${companyId}/license${args}`);
};

const licenseCreateItem = (companyId, data) => {
  return api.post(`/api/v1/client/company/${companyId}/license/`, data);
};

const addressIndex = (companyId) => {
  return api.get(`/api/v1/client/company/${companyId}/address`);
};

const fileIndex = (companyId, cnpj, cnae, args) => {
  let url = `/api/v1/client/company/${companyId}/file`;

  if (cnpj !== '') {
    url += `/${cnpj}`;
  }

  if (cnae !== '') {
    url += `/${cnae}`;
  }

  return api.get(url + `?_locale=pt_BR&timestamp=${timestamp}${args}`);
};

export default {
  index,
  consultItem,
  createItem,
  importItem,
  readItem,
  updateItem,
  deleteItem,
  logoCreateItem,
  logoDeleteItem,
  cnpjIndex,
  cnpjCreateItem,
  cnpjDeleteItem,
  cnaeIndex,
  licenseIndex,
  licenseCreateItem,
  addressIndex,
  fileIndex,
  licensesStatus,
};
