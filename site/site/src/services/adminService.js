import api from './api';

export const adminService = {
  listarAdmins: () => api.get('/usuarios/admins'),
  
  listarOperadores: () => api.get('/usuarios/operadores'),
  
  criarAdmin: (data) => api.post('/usuarios/admin', data),
};

export default adminService;
