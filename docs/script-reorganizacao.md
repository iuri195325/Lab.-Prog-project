# 🔧 Script de Reorganização do Front-end

## ⚠️ IMPORTANTE: Leia Antes de Executar

Este documento contém os comandos para reorganizar o front-end do projeto.
Execute os comandos na ordem apresentada.

---

## 📋 Pré-requisitos

1. Faça backup do projeto antes de começar
2. Certifique-se de estar na pasta `site/site`
3. Tenha o Git instalado (para mover arquivos mantendo histórico)

---

## 🚀 Comandos de Reorganização

### Passo 1: Criar Nova Estrutura de Pastas

```powershell
# Navegar para a pasta do projeto front-end
cd "c:\Users\iuri\OneDrive\Desktop\Lab. Prog\site\site"

# Criar estrutura de componentes
New-Item -ItemType Directory -Force -Path "src\components\common\Topbar"
New-Item -ItemType Directory -Force -Path "src\components\common\Taskbar"
New-Item -ItemType Directory -Force -Path "src\components\auth\Login"
New-Item -ItemType Directory -Force -Path "src\components\auth\Registro"
New-Item -ItemType Directory -Force -Path "src\components\dashboard\MainSystem"
New-Item -ItemType Directory -Force -Path "src\components\dashboard\InboxPanel"
New-Item -ItemType Directory -Force -Path "src\components\dashboard\CasosPanel"
New-Item -ItemType Directory -Force -Path "src\components\dashboard\DetailPanel"
New-Item -ItemType Directory -Force -Path "src\components\dashboard\Chat"
New-Item -ItemType Directory -Force -Path "src\components\home"
New-Item -ItemType Directory -Force -Path "src\components\user\UserPanel"
New-Item -ItemType Directory -Force -Path "src\components\user\DenunciaForm"
New-Item -ItemType Directory -Force -Path "src\components\user\MinhasDenuncias"

# Criar estrutura de services, utils e hooks
New-Item -ItemType Directory -Force -Path "src\services"
New-Item -ItemType Directory -Force -Path "src\utils"
New-Item -ItemType Directory -Force -Path "src\hooks"
```

### Passo 2: Mover Componentes da Raiz

```powershell
# Mover Topbar
Move-Item -Path "Topbar.jsx" -Destination "src\components\common\Topbar\Topbar.jsx"
Move-Item -Path "Topbar.css" -Destination "src\components\common\Topbar\Topbar.css"

# Mover Taskbar
Move-Item -Path "Taskbar.jsx" -Destination "src\components\common\Taskbar\Taskbar.jsx"
Move-Item -Path "Taskbar.css" -Destination "src\components\common\Taskbar\Taskbar.css"

# Mover InboxPanel
Move-Item -Path "InboxPanel.jsx" -Destination "src\components\dashboard\InboxPanel\InboxPanel.jsx"
Move-Item -Path "InboxPanel.css" -Destination "src\components\dashboard\InboxPanel\InboxPanel.css"

# Mover CasosPanel
Move-Item -Path "CasosPanel.jsx" -Destination "src\components\dashboard\CasosPanel\CasosPanel.jsx"
Move-Item -Path "CasosPanel.css" -Destination "src\components\dashboard\CasosPanel\CasosPanel.css"

# Mover DetailPanel
Move-Item -Path "DetailPanel.jsx" -Destination "src\components\dashboard\DetailPanel\DetailPanel.jsx"
Move-Item -Path "Detailpanel.css" -Destination "src\components\dashboard\DetailPanel\DetailPanel.css"

# Mover Chat
Move-Item -Path "Chat.jsx" -Destination "src\components\dashboard\Chat\Chat.jsx"
Move-Item -Path "Chat.css" -Destination "src\components\dashboard\Chat\Chat.css"
```

### Passo 3: Mover Componentes de src/assets/Componentes

```powershell
# Mover Login
Move-Item -Path "src\assets\Componentes\Login\Login.jsx" -Destination "src\components\auth\Login\Login.jsx"
Move-Item -Path "src\assets\Componentes\Login\Login.css" -Destination "src\components\auth\Login\Login.css"

# Mover Registro
Move-Item -Path "src\assets\Componentes\Registro\Registro.jsx" -Destination "src\components\auth\Registro\Registro.jsx"
Move-Item -Path "src\assets\Componentes\Registro\Registro.css" -Destination "src\components\auth\Registro\Registro.css"

# Mover Home
Move-Item -Path "src\assets\Componentes\Home\Home.jsx" -Destination "src\components\home\Home.jsx"
Move-Item -Path "src\assets\Componentes\Home\Home.css" -Destination "src\components\home\Home.css"

# Mover Dashboard (se existir como componente separado)
Move-Item -Path "src\assets\Componentes\Dashboard\Dashboard.jsx" -Destination "src\components\dashboard\Dashboard.jsx" -ErrorAction SilentlyContinue
Move-Item -Path "src\assets\Componentes\Dashboard\Dashboard.css" -Destination "src\components\dashboard\Dashboard.css" -ErrorAction SilentlyContinue

# Mover MainSystem
Move-Item -Path "src\assets\Componentes\MainSystem\MainSystem.jsx" -Destination "src\components\dashboard\MainSystem\MainSystem.jsx"
Move-Item -Path "src\assets\Componentes\MainSystem\MainSystem.css" -Destination "src\components\dashboard\MainSystem\MainSystem.css"
```

### Passo 4: Limpar Pastas Vazias

```powershell
# Remover pasta assets/Componentes (agora vazia)
Remove-Item -Path "src\assets\Componentes" -Recurse -Force -ErrorAction SilentlyContinue
```

---

## 📝 Arquivos a Criar Manualmente

Após mover os componentes, você precisará criar os seguintes arquivos novos:

### 1. `src/services/api.js`
### 2. `src/services/denunciaService.js`
### 3. `src/services/casoService.js`
### 4. `src/utils/constants.js`
### 5. `src/utils/helpers.js`
### 6. `src/hooks/useAuth.js`

**Os conteúdos desses arquivos estão no documento [guia-reorganizacao-frontend.md](./guia-reorganizacao-frontend.md)**

---

## 🔄 Atualização de Imports

Após mover os arquivos, você precisará atualizar os imports. Aqui estão os principais:

### `src/components/dashboard/MainSystem/MainSystem.jsx`

**Substituir:**
```javascript
import Topbar from '../../../../Topbar'
import InboxPanel from '../../../../InboxPanel'
import CasosPanel from '../../../../CasosPanel'
import DetailPanel from '../../../../DetailPanel'
import Taskbar from '../../../../Taskbar'
import { MOCK_DENUNCIAS, MOCK_CASOS } from '../../../../data/mockData'
```

**Por:**
```javascript
import Topbar from '../../common/Topbar/Topbar'
import InboxPanel from '../InboxPanel/InboxPanel'
import CasosPanel from '../CasosPanel/CasosPanel'
import DetailPanel from '../DetailPanel/DetailPanel'
import Taskbar from '../../common/Taskbar/Taskbar'
// Temporariamente manter mockData até integrar com API
import { MOCK_DENUNCIAS, MOCK_CASOS } from '../../../../data/mockData'
```

### `src/App.jsx`

**Atualizar imports de:**
```javascript
import Login from './assets/Componentes/Login/Login'
import Registro from './assets/Componentes/Registro/Registro'
import Home from './assets/Componentes/Home/Home'
import Dashboard from './assets/Componentes/Dashboard/Dashboard'
import MainSystem from './assets/Componentes/MainSystem/MainSystem'
```

**Para:**
```javascript
import Login from './components/auth/Login/Login'
import Registro from './components/auth/Registro/Registro'
import Home from './components/home/Home'
import Dashboard from './components/dashboard/Dashboard'
import MainSystem from './components/dashboard/MainSystem/MainSystem'
```

---

## ✅ Verificação

Após executar todos os comandos, sua estrutura deve estar assim:

```
src/
├── components/
│   ├── common/
│   │   ├── Topbar/
│   │   │   ├── Topbar.jsx ✅
│   │   │   └── Topbar.css ✅
│   │   └── Taskbar/
│   │       ├── Taskbar.jsx ✅
│   │       └── Taskbar.css ✅
│   ├── auth/
│   │   ├── Login/
│   │   │   ├── Login.jsx ✅
│   │   │   └── Login.css ✅
│   │   └── Registro/
│   │       ├── Registro.jsx ✅
│   │       └── Registro.css ✅
│   ├── dashboard/
│   │   ├── MainSystem/
│   │   │   ├── MainSystem.jsx ✅
│   │   │   └── MainSystem.css ✅
│   │   ├── InboxPanel/
│   │   │   ├── InboxPanel.jsx ✅
│   │   │   └── InboxPanel.css ✅
│   │   ├── CasosPanel/
│   │   │   ├── CasosPanel.jsx ✅
│   │   │   └── CasosPanel.css ✅
│   │   ├── DetailPanel/
│   │   │   ├── DetailPanel.jsx ✅
│   │   │   └── DetailPanel.css ✅
│   │   └── Chat/
│   │       ├── Chat.jsx ✅
│   │       └── Chat.css ✅
│   └── home/
│       ├── Home.jsx ✅
│       └── Home.css ✅
├── services/
│   └── authService.js ✅ (já existe)
├── utils/ (vazio por enquanto)
└── hooks/ (vazio por enquanto)
```

---

## 🧪 Testar Aplicação

Após reorganizar, teste se tudo está funcionando:

```powershell
# Instalar dependências (se necessário)
npm install

# Rodar aplicação
npm run dev
```

Verifique se:
- [ ] A aplicação inicia sem erros
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Todos os componentes são renderizados
- [ ] Não há erros no console

---

## 🐛 Solução de Problemas

### Erro: "Cannot find module"
- Verifique se todos os imports foram atualizados
- Verifique se os arquivos foram movidos corretamente

### Erro: "Module not found: Error: Can't resolve"
- Verifique os caminhos relativos nos imports
- Use `../../` para subir níveis de pasta

### CSS não carrega
- Verifique se os arquivos `.css` foram movidos junto com os `.jsx`
- Verifique se os imports de CSS estão corretos

---

## 📌 Próximos Passos Após Reorganização

1. ✅ Reorganização concluída
2. ⏭️ Criar novos services (api.js, denunciaService.js, casoService.js)
3. ⏭️ Criar utils (constants.js, helpers.js)
4. ⏭️ Criar hooks (useAuth.js)
5. ⏭️ Implementar componentes de usuário (UserPanel, DenunciaForm, MinhasDenuncias)
6. ⏭️ Integrar com API do back-end
7. ⏭️ Remover mockData.js

---

**Script de Reorganização - Sistema de Denúncias**
