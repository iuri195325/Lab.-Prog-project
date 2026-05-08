# 📚 Documentação do Sistema de Denúncias

## 📖 Índice de Documentos

Este diretório contém toda a documentação técnica do sistema de denúncias anônimas.

---

## 📄 Documentos Disponíveis

### 1. **[Prompt de Desenvolvimento](./prompt-desenvolvimento.md)**
Documento principal com todas as especificações técnicas do projeto:
- Visão geral do sistema
- Modelagem completa do banco de dados (5 entidades)
- Estrutura reorganizada do front-end
- Tarefas de desenvolvimento divididas em 4 fases
- Regras de negócio e permissões
- Endpoints da API
- Checklist completo

**Use este documento como guia principal para desenvolvimento.**

---

### 2. **[Diagrama de Fluxo do Sistema](./diagrama-fluxo-sistema.md)**
Fluxogramas detalhados de todos os processos:
- Fluxo de autenticação e roteamento
- Fluxo de cadastro de denúncia (cidadão)
- Fluxo de gerenciamento (operador/admin)
- Fluxo de chat entre operador e denunciante
- Fluxo de atualização de status
- Fluxo de autorização por tipo de usuário
- Fluxo de upload de anexos
- Visão geral completa do sistema

**Use este documento para entender o comportamento do sistema.**

---

### 3. **[Diagrama de Entidades do Banco](./diagrama-entidades-banco.md)**
Modelagem completa do banco de dados:
- Modelo Entidade-Relacionamento (ER) em Mermaid
- Detalhamento de todas as 5 tabelas
- Relacionamentos e cardinalidades
- Índices e constraints
- Enums e valores permitidos
- Diagrama de classes C#
- Script SQL completo de criação

**Use este documento para implementar o banco de dados.**

---

### 4. **[Guia de Reorganização do Front-end](./guia-reorganizacao-frontend.md)**
Plano completo de reorganização da estrutura de pastas:
- Comparação estrutura atual vs. nova
- Mapeamento de mudanças
- Novos arquivos a criar (services, utils, hooks)
- Checklist de reorganização
- Benefícios da nova estrutura

**Use este documento para reorganizar o front-end.**

---

## 🎯 Resumo Executivo

### O que é o Sistema?

Sistema web de gerenciamento de denúncias anônimas com:
- **Front-end**: React + Vite
- **Back-end**: ASP.NET Core 9.0 + MySQL
- **Autenticação**: JWT

### Principais Funcionalidades

#### Para Cidadãos:
- Cadastrar denúncias (anônimas ou identificadas)
- Acompanhar status das denúncias
- Visualizar histórico
- Comunicar-se com operadores via chat

#### Para Operadores/Administradores:
- Visualizar todas as denúncias
- Promover denúncias para casos
- Gerenciar casos abertos
- Chat com denunciantes
- Atualizar status dos casos

---

## 🗄️ Entidades do Banco de Dados

### 1. **Usuario**
- Armazena dados de login
- **NOVO**: Campo `TipoUsuario` (Cidadão, Operador, Administrador)

### 2. **Denuncia** (NOVA)
- Tipo, prioridade, local, descrição
- Pode ser anônima ou identificada
- Código de acompanhamento único

### 3. **Caso** (NOVA)
- Criado a partir de uma denúncia promovida
- Status: aberto, em_andamento, resolvido, fechado
- Operador responsável

### 4. **MensagemCaso** (NOVA)
- Chat entre operador e denunciante
- Remetente: "operador" ou "denunciante"

### 5. **AnexoDenuncia** (NOVA)
- Arquivos anexados à denúncia
- Tipos: audio, foto, video

---

## 🔄 Fluxo Básico do Sistema

```
1. Cidadão faz login → Redireciona para /user
2. Cidadão cadastra denúncia → Salva no BD
3. Operador visualiza denúncia no Dashboard
4. Operador promove denúncia → Vira um Caso
5. Operador e denunciante conversam via chat
6. Operador atualiza status → Resolve/Fecha caso
```

---

## 📁 Nova Estrutura do Front-end

```
src/
├── components/
│   ├── common/          # Topbar, Taskbar, etc
│   ├── auth/            # Login, Registro
│   ├── dashboard/       # Painel operador/admin
│   ├── user/            # Painel cidadão (NOVO)
│   └── home/            # Página inicial
├── services/            # API calls
├── utils/               # Constantes, helpers
└── hooks/               # Custom hooks
```

---

## ✅ Próximos Passos

### FASE 1: Back-end
1. Adicionar campo `TipoUsuario` no model `Usuario`
2. Criar 4 novos models: `Denuncia`, `Caso`, `MensagemCaso`, `AnexoDenuncia`
3. Atualizar `AppDbContext`
4. Criar DTOs
5. Criar Endpoints
6. Executar migration

### FASE 2: Front-end - Reorganização
1. Criar nova estrutura de pastas
2. Mover componentes existentes
3. Atualizar imports

### FASE 3: Front-end - Novos Componentes
1. Criar services (denunciaService, casoService)
2. Criar componente UserPanel (tela do cidadão)
3. Criar componente DenunciaForm
4. Criar componente MinhasDenuncias

### FASE 4: Integração
1. Integrar front-end com back-end
2. Remover dados mockados
3. Implementar autorização por tipo de usuário
4. Testes completos

---

## 🔐 Permissões por Tipo de Usuário

| Funcionalidade | Cidadão | Operador | Admin |
|----------------|---------|----------|-------|
| Criar denúncia | ✅ | ✅ | ✅ |
| Ver próprias denúncias | ✅ | ✅ | ✅ |
| Ver todas denúncias | ❌ | ✅ | ✅ |
| Promover para caso | ❌ | ✅ | ✅ |
| Gerenciar casos | ❌ | ✅ | ✅ |
| Gerenciar usuários | ❌ | ❌ | ✅ |

---

## 📊 Endpoints da API (Novos)

### Denúncias
```
GET    /api/denuncias              # Listar todas
GET    /api/denuncias/{id}         # Buscar por ID
GET    /api/denuncias/minhas       # Minhas denúncias
POST   /api/denuncias              # Criar
PUT    /api/denuncias/{id}         # Atualizar
DELETE /api/denuncias/{id}         # Deletar
POST   /api/denuncias/{id}/promover # Promover para caso
```

### Casos
```
GET    /api/casos                  # Listar todos
GET    /api/casos/{id}             # Buscar por ID
PUT    /api/casos/{id}             # Atualizar status
POST   /api/casos/{id}/mensagens   # Enviar mensagem
GET    /api/casos/{id}/mensagens   # Listar mensagens
```

---

## 🛠️ Tecnologias

### Back-end
- ASP.NET Core 9.0
- Entity Framework Core
- MySQL 8.0
- JWT Authentication
- BCrypt (hash de senhas)

### Front-end
- React 18
- Vite
- React Router
- Axios
- React Toastify

---

## 📞 Como Usar Esta Documentação

1. **Começando**: Leia o [Prompt de Desenvolvimento](./prompt-desenvolvimento.md)
2. **Entendendo o Fluxo**: Consulte os [Diagramas de Fluxo](./diagrama-fluxo-sistema.md)
3. **Implementando BD**: Use o [Diagrama de Entidades](./diagrama-entidades-banco.md)
4. **Reorganizando Front**: Siga o [Guia de Reorganização](./guia-reorganizacao-frontend.md)

---

## 🎨 Padrão Visual

O sistema segue um padrão de cores consistente:
- **Alta prioridade**: Vermelho (#ef4444)
- **Média prioridade**: Laranja (#f59e0b)
- **Baixa prioridade**: Verde (#10b981)

Layout inspirado no dashboard operacional já existente (MainSystem).

---

**Desenvolvido para Sistema de Denúncias Anônimas**  
**Versão da Documentação**: 1.0  
**Data**: 2026
