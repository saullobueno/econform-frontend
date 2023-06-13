import api from 'services/api';

const index = (args) => {
  return api.get(`/api/v1/client/kpis?_locale=pt_br&${args}`);
};

export default {
  index,
};
