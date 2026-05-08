import api from './api';

export const denunciaService = {
  listar: async () => {
    return api.get('/denuncias');
  },

  listarPendentes: async () => {
    return api.get('/denuncias/pendentes');
  },

  minhasDenuncias: async () => {
    return api.get('/denuncias/minhas');
  },

  buscarPorId: async (id) => {
    return api.get(`/denuncias/${id}`);
  },

  criar: async (dados) => {
    return api.post('/denuncias', dados);
  },

  atualizar: async (id, dados) => {
    return api.put(`/denuncias/${id}`, dados);
  },

  deletar: async (id) => {
    return api.delete(`/denuncias/${id}`);
  },

  promoverParaCaso: async (id) => {
    return api.post(`/denuncias/${id}/promover`);
  },
};

export default denunciaService;
