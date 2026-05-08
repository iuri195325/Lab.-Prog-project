import api from './api';

export const viaturaService = {
  listar: () => api.get('/viaturas'),
  
  buscarPorId: (id) => api.get(`/viaturas/${id}`),
  
  listarDisponiveis: () => api.get('/viaturas/disponiveis'),
  
  criar: (data) => api.post('/viaturas', data),
  
  atualizar: (id, data) => api.put(`/viaturas/${id}`, data),
  
  atualizarStatus: (id, status) => api.put(`/viaturas/${id}/status`, { status }),
  
  deletar: (id) => api.delete(`/viaturas/${id}`),
};

export default viaturaService;
