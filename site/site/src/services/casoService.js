import api from './api';

export const casoService = {
  listar: async () => {
    return api.get('/casos');
  },

  buscarPorId: async (id) => {
    return api.get(`/casos/${id}`);
  },

  atualizar: async (id, dados) => {
    return api.put(`/casos/${id}`, dados);
  },

  deletar: async (id) => {
    return api.delete(`/casos/${id}`);
  },

  listarMensagens: async (casoId) => {
    return api.get(`/casos/${casoId}/mensagens`);
  },

  enviarMensagem: async (casoId, texto) => {
    return api.post(`/casos/${casoId}/mensagens`, { texto });
  },

  vincularViatura: async (casoId, viaturaId) => {
    return api.post(`/casos/${casoId}/vincular-viatura`, { viaturaId });
  },

  desvincularViatura: async (casoId) => {
    return api.delete(`/casos/${casoId}/desvincular-viatura`);
  },
};

export default casoService;
