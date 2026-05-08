# 📁 Guia de Reorganização do Front-end

## 🎯 Objetivo

Reorganizar a estrutura de pastas do front-end para melhorar a manutenibilidade e escalabilidade do projeto.

---

## 📊 Estrutura Atual (Desorganizada)

```
site/site/
├── src/
│   ├── assets/
│   │   └── Componentes/
│   │       ├── Dashboard/
│   │       ├── Home/
│   │       ├── Login/
│   │       ├── MainSystem/
│   │       └── Registro/
│   ├── services/
│   │   └── authService.js
│   ├── App.jsx
│   └── main.jsx
├── CasosPanel.jsx        ❌ Na raiz
├── InboxPanel.jsx        ❌ Na raiz
├── DetailPanel.jsx       ❌ Na raiz
├── Topbar.jsx           ❌ Na raiz
├── Taskbar.jsx          ❌ Na raiz
├── Chat.jsx             ❌ Na raiz
└── data/
    └── mockData.js      ❌ Dados mockados
```

**Problemas:**
- Componentes espalhados entre `src/assets/Componentes` e raiz do projeto
- Falta de organização por funcionalidade
- Dados mockados misturados com código
- Difícil navegação e manutenção

---

## ✅ Nova Estrutura (Organizada)

```
site/site/
├── public/
│   └── assets/
│       └── images/
│
├── src/
│   ├── components/
│   │   ├── common/              # Componentes reutilizáveis
│   │   │   ├── Topbar/
│   │   │   │   ├── Topbar.jsx
│   │   │   │   └── Topbar.css
│   │   │   ├── Taskbar/
│   │   │   │   ├── Taskbar.jsx
│   │   │   │   └── Taskbar.css
│   │   │   └── Button/
│   │   │       ├── Button.jsx
│   │   │       └── Button.css
│   │   │
│   │   ├── auth/                # Autenticação
│   │   │   ├── Login/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Login.css
│   │   │   └── Registro/
│   │   │       ├── Registro.jsx
│   │   │       └── Registro.css
│   │   │
│   │   ├── dashboard/           # Painel administrativo (Operador/Admin)
│   │   │   ├── MainSystem/
│   │   │   │   ├── MainSystem.jsx
│   │   │   │   └── MainSystem.css
│   │   │   ├── InboxPanel/
│   │   │   │   ├── InboxPanel.jsx
│   │   │   │   └── InboxPanel.css
│   │   │   ├── CasosPanel/
│   │   │   │   ├── CasosPanel.jsx
│   │   │   │   └── CasosPanel.css
│   │   │   ├── DetailPanel/
│   │   │   │   ├── DetailPanel.jsx
│   │   │   │   └── DetailPanel.css
│   │   │   └── Chat/
│   │   │       ├── Chat.jsx
│   │   │       └── Chat.css
│   │   │
│   │   ├── user/                # Tela do usuário cidadão (NOVO)
│   │   │   ├── UserPanel/
│   │   │   │   ├── UserPanel.jsx
│   │   │   │   └── UserPanel.css
│   │   │   ├── DenunciaForm/
│   │   │   │   ├── DenunciaForm.jsx
│   │   │   │   └── DenunciaForm.css
│   │   │   └── MinhasDenuncias/
│   │   │       ├── MinhasDenuncias.jsx
│   │   │       └── MinhasDenuncias.css
│   │   │
│   │   └── home/                # Página inicial
│   │       ├── Home.jsx
│   │       └── Home.css
│   │
│   ├── services/                # Serviços e APIs
│   │   ├── api.js               # Cliente HTTP base
│   │   ├── authService.js       # Autenticação
│   │   ├── denunciaService.js   # CRUD de denúncias (NOVO)
│   │   └── casoService.js       # CRUD de casos (NOVO)
│   │
│   ├── utils/                   # Utilitários (NOVO)
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   ├── hooks/                   # Custom hooks (NOVO)
│   │   └── useAuth.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔄 Mapeamento de Mudanças

### Componentes a Mover

| Origem | Destino |
|--------|---------|
| `site/site/Topbar.jsx` | `src/components/common/Topbar/Topbar.jsx` |
| `site/site/Taskbar.jsx` | `src/components/common/Taskbar/Taskbar.jsx` |
| `src/assets/Componentes/Login/` | `src/components/auth/Login/` |
| `src/assets/Componentes/Registro/` | `src/components/auth/Registro/` |
| `src/assets/Componentes/Home/` | `src/components/home/` |
| `src/assets/Componentes/Dashboard/` | `src/components/dashboard/Dashboard/` |
| `src/assets/Componentes/MainSystem/` | `src/components/dashboard/MainSystem/` |
| `site/site/InboxPanel.jsx` | `src/components/dashboard/InboxPanel/InboxPanel.jsx` |
| `site/site/CasosPanel.jsx` | `src/components/dashboard/CasosPanel/CasosPanel.jsx` |
| `site/site/DetailPanel.jsx` | `src/components/dashboard/DetailPanel/DetailPanel.jsx` |
| `site/site/Chat.jsx` | `src/components/dashboard/Chat/Chat.jsx` |

### Arquivos a Remover (após integração com API)

- `site/site/data/mockData.js`

---

## 📝 Atualizações de Imports Necessárias

### Exemplo: MainSystem.jsx

**Antes:**
```javascript
import Topbar from '../../../../Topbar'
import InboxPanel from '../../../../InboxPanel'
import CasosPanel from '../../../../CasosPanel'
import DetailPanel from '../../../../DetailPanel'
import Taskbar from '../../../../Taskbar'
import { MOCK_DENUNCIAS, MOCK_CASOS } from '../../../../data/mockData'
```

**Depois:**
```javascript
import Topbar from '../../common/Topbar/Topbar'
import InboxPanel from '../InboxPanel/InboxPanel'
import CasosPanel from '../CasosPanel/CasosPanel'
import DetailPanel from '../DetailPanel/DetailPanel'
import Taskbar from '../../common/Taskbar/Taskbar'
import { denunciaService } from '../../../services/denunciaService'
import { casoService } from '../../../services/casoService'
```

---

## 🆕 Novos Arquivos a Criar

### 1. `src/services/api.js`
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5242/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 2. `src/services/denunciaService.js`
```javascript
import api from './api';

export const denunciaService = {
  listar: async () => {
    const response = await api.get('/denuncias');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/denuncias/${id}`);
    return response.data;
  },

  minhasDenuncias: async () => {
    const response = await api.get('/denuncias/minhas');
    return response.data;
  },

  criar: async (dados) => {
    const response = await api.post('/denuncias', dados);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/denuncias/${id}`, dados);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/denuncias/${id}`);
    return response.data;
  },

  promoverParaCaso: async (id) => {
    const response = await api.post(`/denuncias/${id}/promover`);
    return response.data;
  },
};
```

### 3. `src/services/casoService.js`
```javascript
import api from './api';

export const casoService = {
  listar: async () => {
    const response = await api.get('/casos');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/casos/${id}`);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/casos/${id}`, dados);
    return response.data;
  },

  enviarMensagem: async (casoId, mensagem) => {
    const response = await api.post(`/casos/${casoId}/mensagens`, { texto: mensagem });
    return response.data;
  },

  listarMensagens: async (casoId) => {
    const response = await api.get(`/casos/${casoId}/mensagens`);
    return response.data;
  },
};
```

### 4. `src/utils/constants.js`
```javascript
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
```

### 5. `src/hooks/useAuth.js`
```javascript
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const response = await authService.login(email, senha);
    setUser(response.data);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user?.tipo === 2;
  };

  const isOperador = () => {
    return user?.tipo === 1;
  };

  const isCidadao = () => {
    return user?.tipo === 0;
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isOperador,
    isCidadao,
  };
};
```

---

## ✅ Checklist de Reorganização

### Fase 1: Criar Estrutura
- [ ] Criar `src/components/common/`
- [ ] Criar `src/components/auth/`
- [ ] Criar `src/components/dashboard/`
- [ ] Criar `src/components/user/`
- [ ] Criar `src/components/home/`
- [ ] Criar `src/services/`
- [ ] Criar `src/utils/`
- [ ] Criar `src/hooks/`

### Fase 2: Mover Componentes
- [ ] Mover Topbar para `common/Topbar/`
- [ ] Mover Taskbar para `common/Taskbar/`
- [ ] Mover Login para `auth/Login/`
- [ ] Mover Registro para `auth/Registro/`
- [ ] Mover Home para `home/`
- [ ] Mover Dashboard para `dashboard/Dashboard/`
- [ ] Mover MainSystem para `dashboard/MainSystem/`
- [ ] Mover InboxPanel para `dashboard/InboxPanel/`
- [ ] Mover CasosPanel para `dashboard/CasosPanel/`
- [ ] Mover DetailPanel para `dashboard/DetailPanel/`
- [ ] Mover Chat para `dashboard/Chat/`

### Fase 3: Atualizar Imports
- [ ] Atualizar imports em MainSystem.jsx
- [ ] Atualizar imports em App.jsx
- [ ] Atualizar imports em todos os componentes movidos

### Fase 4: Criar Novos Arquivos
- [ ] Criar `services/api.js`
- [ ] Criar `services/denunciaService.js`
- [ ] Criar `services/casoService.js`
- [ ] Criar `utils/constants.js`
- [ ] Criar `hooks/useAuth.js`

### Fase 5: Limpeza
- [ ] Remover pasta `src/assets/Componentes/` (vazia)
- [ ] Remover arquivos da raiz (após mover)
- [ ] Remover `data/mockData.js` (após integração com API)

---

## 🎯 Benefícios da Nova Estrutura

1. **Organização por Funcionalidade**: Componentes agrupados por contexto
2. **Reutilização**: Componentes comuns separados
3. **Escalabilidade**: Fácil adicionar novos componentes
4. **Manutenibilidade**: Código mais fácil de encontrar e modificar
5. **Separação de Responsabilidades**: Services, utils e hooks separados
6. **Imports Limpos**: Caminhos relativos mais curtos e claros

---

**Sistema de Denúncias - Guia de Reorganização**
