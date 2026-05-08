export const TIPOS_DENUNCIA = [
  { value: 'violencia', label: 'Violência' },
  { value: 'furto', label: 'Furto' },
  { value: 'trafico', label: 'Tráfico' },
  { value: 'vandalismo', label: 'Vandalismo' },
  { value: 'perturbacao', label: 'Perturbação' },
  { value: 'outros', label: 'Outros' },
];

export const PRIORIDADES = [
  { value: 'alta', label: 'Alta', color: '#ef4444' },
  { value: 'media', label: 'Média', color: '#f59e0b' },
  { value: 'baixa', label: 'Baixa', color: '#10b981' },
];

export const STATUS_CASO = [
  { value: 'aberto', label: 'Aberto', color: '#3b82f6' },
  { value: 'em_andamento', label: 'Em Andamento', color: '#f59e0b' },
  { value: 'resolvido', label: 'Resolvido', color: '#10b981' },
  { value: 'fechado', label: 'Fechado', color: '#6b7280' },
];

export const TIPOS_USUARIO = {
  CIDADAO: 0,
  OPERADOR: 1,
  ADMINISTRADOR: 2,
};

export const TIPOS_VIATURA = [
  { value: 'Patrulha', label: 'Patrulha' },
  { value: 'Resgate', label: 'Resgate' },
  { value: 'Investigação', label: 'Investigação' },
];

export const STATUS_VIATURA = [
  { value: 'Disponível', label: 'Disponível', color: '#44ff44' },
  { value: 'Em Atendimento', label: 'Em Atendimento', color: '#ffaa00' },
  { value: 'Manutenção', label: 'Manutenção', color: '#ff4444' },
  { value: 'Indisponível', label: 'Indisponível', color: '#888888' },
];

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5242/api';
