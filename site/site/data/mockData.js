// Mock data para o sistema DISPATCHER NET

export const VIATURAS = [
  { id: 'VTR-01', status: 'disponivel' },
  { id: 'VTR-02', status: 'ocupada' },
  { id: 'VTR-03', status: 'disponivel' },
  { id: 'VTR-04', status: 'manutencao' },
  { id: 'VTR-05', status: 'ocupada' },
  { id: 'VTR-06', status: 'disponivel' }
]

export const FONES = [
  { ico: '🚑', nome: 'SAMU', num: '192' },
  { ico: '🚒', nome: 'Bombeiros', num: '193' },
  { ico: '👮', nome: 'Polícia Militar', num: '190' },
  { ico: '🚔', nome: 'Polícia Civil', num: '197' },
  { ico: '⚡', nome: 'Defesa Civil', num: '199' },
  { ico: '🚨', nome: 'Emergência Geral', num: '911' }
]

export const MOCK_DENUNCIAS = [
  {
    id: 'DEN001',
    tipo: 'violencia',
    prioridade: 'alta',
    local: 'Rua das Palmeiras, 456',
    desc: 'Denúncia de agressão física entre vizinhos',
    anexos: ['audio', 'foto'],
    hora: '15:45'
  },
  {
    id: 'DEN002', 
    tipo: 'furto',
    prioridade: 'media',
    local: 'Avenida Central, 789',
    desc: 'Furto de bicicleta em frente ao mercado',
    anexos: ['video'],
    hora: '14:20'
  },
  {
    id: 'DEN003',
    tipo: 'trafico',
    prioridade: 'alta',
    local: 'Praça da Liberdade',
    desc: 'Suspeita de tráfico de drogas na praça',
    anexos: ['foto'],
    hora: '13:30'
  },
  {
    id: 'DEN004',
    tipo: 'furto',
    prioridade: 'baixa',
    local: 'Shopping Boulevard',
    desc: 'Tentativa de furto no estacionamento',
    anexos: [],
    hora: '12:15'
  },
  {
    id: 'DEN005',
    tipo: 'violencia',
    prioridade: 'media',
    local: 'Escola Municipal Santos',
    desc: 'Briga entre estudantes no pátio da escola',
    anexos: ['video', 'foto'],
    hora: '11:50'
  }
]

export const MOCK_CASOS = [
  {
    id: 'CASO001',
    tipo: 'violencia',
    prioridade: 'alta',
    status: 'em_andamento',
    anon: 'ANON_7834',
    data: '23/03/2026',
    local: 'Rua das Flores, 123',
    desc: 'Caso de violência doméstica em andamento',
    msgs: [
      { id: 'msg_initial_1', de: 'denunciante', txt: 'Preciso de ajuda urgente', hora: '14:30' },
      { id: 'msg_initial_2', de: 'op', txt: 'Viatura a caminho. Mantenha-se em local seguro.', hora: '14:32' }
    ]
  }
]
