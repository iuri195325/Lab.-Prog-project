import api from './api';

export const relatorioService = {
  dashboard: (dataInicio, dataFim) => {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    return api.get(`/relatorios/dashboard?${params.toString()}`);
  },
  
  denuncias: (dataInicio, dataFim) => {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    return api.get(`/relatorios/denuncias?${params.toString()}`);
  },
  
  casos: (dataInicio, dataFim) => {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    return api.get(`/relatorios/casos?${params.toString()}`);
  },
  
  viaturas: () => api.get('/relatorios/viaturas'),
  
  operadores: (dataInicio, dataFim) => {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    return api.get(`/relatorios/operadores?${params.toString()}`);
  },
};

export default relatorioService;
