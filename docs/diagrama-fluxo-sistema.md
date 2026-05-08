# 🔄 Diagrama de Fluxo Completo do Sistema de Denúncias

## Fluxo Unificado do Sistema

```mermaid
flowchart TB
    %% ========== ENTRADA DO SISTEMA ==========
    subgraph ACESSO["🔐 ACESSO AO SISTEMA"]
        START([Usuário Acessa]) --> LOGIN[Tela de Login]
        LOGIN --> AUTH{Credenciais Válidas?}
        AUTH -->|Não| ERRO_LOGIN[Erro: Credenciais Inválidas]
        ERRO_LOGIN --> LOGIN
        AUTH -->|Sim| JWT[Gerar JWT Token]
        JWT --> STORE[Armazenar Token + Dados]
        STORE --> TIPO{Tipo de Usuário?}
        
        REG[Tela de Registro] --> REG_FORM[Formulário Cidadão]
        REG_FORM --> REG_VALID{Dados Válidos?}
        REG_VALID -->|Não| REG_ERRO[Mostrar Erros]
        REG_ERRO --> REG_FORM
        REG_VALID -->|Sim| REG_SAVE[Criar Usuário Cidadão]
        REG_SAVE --> LOGIN
    end

    %% ========== CIDADÃO ==========
    subgraph CIDADAO["👤 PAINEL DO CIDADÃO"]
        TIPO -->|Cidadão| USER_PANEL[UserPanel]
        
        USER_PANEL --> USER_MENU{Menu}
        USER_MENU --> NOVA_DEN[Nova Denúncia]
        USER_MENU --> MINHAS_DEN[Minhas Denúncias]
        USER_MENU --> ACOMP_CASO[Acompanhar Casos]
        USER_MENU --> USER_LOGOUT[Logout]
        
        %% Nova Denúncia
        NOVA_DEN --> DEN_FORM[Formulário de Denúncia]
        DEN_FORM --> DEN_TIPO[Tipo da Denúncia]
        DEN_TIPO --> DEN_LOCAL[Local]
        DEN_LOCAL --> DEN_DESC[Descrição]
        DEN_DESC --> DEN_PRIO[Prioridade]
        DEN_PRIO --> DEN_ANEXO{Anexos?}
        DEN_ANEXO -->|Sim| UPLOAD[Upload Arquivos]
        UPLOAD --> DEN_ANON{Anônima?}
        DEN_ANEXO -->|Não| DEN_ANON
        DEN_ANON -->|Sim| COD_ANON[Gerar Código Anônimo]
        DEN_ANON -->|Não| VINC_USER[Vincular ao Usuário]
        COD_ANON --> ENVIAR_DEN[Enviar Denúncia]
        VINC_USER --> ENVIAR_DEN
        ENVIAR_DEN --> DEN_SUCCESS[Sucesso + Código]
        DEN_SUCCESS --> USER_PANEL
        
        %% Minhas Denúncias
        MINHAS_DEN --> LIST_DEN[Listar Denúncias]
        LIST_DEN --> DEN_CARD[Cards de Denúncias]
        DEN_CARD --> DEN_EDIT[Editar]
        DEN_CARD --> DEN_DEL[Excluir]
        DEN_CARD --> DEN_VIEW[Ver Detalhes]
        
        %% Acompanhar Casos
        ACOMP_CASO --> MEUS_CASOS[Meus Casos]
        MEUS_CASOS --> CASO_CHAT[Chat com Operador]
    end

    %% ========== OPERADOR/ADMIN ==========
    subgraph OPERADOR["👷 DASHBOARD OPERACIONAL"]
        TIPO -->|Operador| DASHBOARD[MainSystem]
        TIPO -->|Admin| DASHBOARD
        
        DASHBOARD --> TOPBAR[Topbar]
        TOPBAR --> CONFIG_BTN{Admin?}
        CONFIG_BTN -->|Sim| CONFIG[Configurações]
        CONFIG_BTN -->|Não| DASH_MAIN
        
        DASHBOARD --> DASH_MAIN[Área Principal]
        DASH_MAIN --> INBOX[InboxPanel]
        DASH_MAIN --> CASOS[CasosPanel]
        DASH_MAIN --> DETAIL[DetailPanel]
        
        %% Inbox
        INBOX --> LIST_INBOX[Listar Denúncias Pendentes]
        LIST_INBOX --> PROMOVER{Promover?}
        PROMOVER -->|Sim| CRIAR_CASO[Criar Caso]
        CRIAR_CASO --> COD_CASO[Gerar Código Caso]
        COD_CASO --> CASO_ABERTO[Status: Aberto]
        CASO_ABERTO --> ADD_CASOS[Adicionar ao CasosPanel]
        
        %% Casos
        CASOS --> SELECT_CASO[Selecionar Caso]
        SELECT_CASO --> DETAIL
        
        %% Detail Panel
        DETAIL --> CASO_INFO[Informações do Caso]
        CASO_INFO --> VIATURA_SEC[Seção Viatura]
        VIATURA_SEC --> VINC_VIA{Viatura Vinculada?}
        VINC_VIA -->|Não| SELECT_VIA[Selecionar Viatura]
        SELECT_VIA --> BTN_VINC[Vincular Viatura]
        BTN_VINC --> VIA_OK[Viatura Vinculada]
        VINC_VIA -->|Sim| BTN_DESV[Desvincular]
        BTN_DESV --> VIATURA_SEC
        
        CASO_INFO --> CHAT[Chat]
        CHAT --> MSG_HIST[Histórico de Mensagens]
        MSG_HIST --> ENVIAR_MSG[Enviar Mensagem]
        ENVIAR_MSG --> SALVAR_MSG[Salvar no BD]
        SALVAR_MSG --> ATUALIZAR_CHAT[Atualizar Chat]
        
        CASO_INFO --> STATUS_CASO{Atualizar Status}
        STATUS_CASO --> EM_ANDAMENTO[Em Andamento]
        STATUS_CASO --> RESOLVIDO[Resolvido]
        STATUS_CASO --> FECHADO[Fechado]
        FECHADO --> DATA_FECH[Registrar Data Fechamento]
    end

    %% ========== CONFIG PANEL (ADMIN) ==========
    subgraph ADMIN["⚙️ PAINEL DE CONFIGURAÇÕES"]
        CONFIG --> CONFIG_TABS{Aba}
        
        CONFIG_TABS --> TAB_ADMIN[Administradores]
        TAB_ADMIN --> LIST_ADMINS[Listar Admins]
        TAB_ADMIN --> NEW_ADMIN[Novo Admin]
        NEW_ADMIN --> ADMIN_FORM[Formulário Admin]
        ADMIN_FORM --> SAVE_ADMIN[Salvar Admin]
        
        CONFIG_TABS --> TAB_VIA[Viaturas]
        TAB_VIA --> LIST_VIA[Listar Viaturas]
        TAB_VIA --> NEW_VIA[Nova Viatura]
        NEW_VIA --> VIA_FORM[Formulário Viatura]
        VIA_FORM --> VIA_PLACA[Placa]
        VIA_PLACA --> VIA_IDENT[Identificação]
        VIA_IDENT --> VIA_TIPO[Tipo]
        VIA_TIPO --> VIA_STATUS[Status]
        VIA_STATUS --> SAVE_VIA[Salvar Viatura]
        LIST_VIA --> EDIT_VIA[Editar Viatura]
        LIST_VIA --> DEL_VIA[Excluir Viatura]
        
        CONFIG_TABS --> TAB_REL[Relatórios]
        TAB_REL --> PERIODO[Selecionar Período]
        PERIODO --> DASH_STATS[Dashboard Estatísticas]
        DASH_STATS --> TOTAL_DEN[Total Denúncias]
        DASH_STATS --> TOTAL_CASOS[Total Casos]
        DASH_STATS --> TEMPO_RESP[Tempo Médio Resposta]
        DASH_STATS --> DEN_TIPO_REL[Denúncias por Tipo]
        DASH_STATS --> DEN_PRIO_REL[Denúncias por Prioridade]
        DASH_STATS --> CASOS_STATUS[Casos por Status]
        DASH_STATS --> VIA_MAIS[Viaturas Mais Utilizadas]
        DASH_STATS --> OP_ATIVOS[Operadores Mais Ativos]
        
        CONFIG --> VOLTAR[Voltar ao Dashboard]
        VOLTAR --> DASHBOARD
    end

    %% ========== BACKEND API ==========
    subgraph API["🖥️ BACK-END API"]
        API_AUTH["/api/auth"]
        API_DEN["/api/denuncias"]
        API_CASOS["/api/casos"]
        API_USERS["/api/usuarios"]
        API_VIA["/api/viaturas"]
        API_REL["/api/relatorios"]
        
        API_AUTH --> AUTH_LOGIN[POST /login]
        
        API_DEN --> DEN_LIST[GET /]
        API_DEN --> DEN_CREATE[POST /]
        API_DEN --> DEN_UPDATE[PUT /:id]
        API_DEN --> DEN_DELETE[DELETE /:id]
        API_DEN --> DEN_PROMOVER[POST /:id/promover]
        
        API_CASOS --> CASO_LIST[GET /]
        API_CASOS --> CASO_GET[GET /:id]
        API_CASOS --> CASO_UPDATE[PUT /:id]
        API_CASOS --> CASO_MSG[POST /:id/mensagens]
        API_CASOS --> CASO_VINC[POST /:id/vincular-viatura]
        API_CASOS --> CASO_DESV[DELETE /:id/desvincular-viatura]
        
        API_USERS --> USER_LIST[GET /]
        API_USERS --> USER_CREATE[POST /]
        API_USERS --> USER_ADMINS[GET /admins]
        API_USERS --> USER_NEW_ADMIN[POST /admin]
        
        API_VIA --> VIA_LIST[GET /]
        API_VIA --> VIA_DISP[GET /disponiveis]
        API_VIA --> VIA_CREATE[POST /]
        API_VIA --> VIA_UPDATE[PUT /:id]
        API_VIA --> VIA_DEL[DELETE /:id]
        
        API_REL --> REL_DASH[GET /dashboard]
        API_REL --> REL_DEN[GET /denuncias]
        API_REL --> REL_CASOS[GET /casos]
        API_REL --> REL_VIA[GET /viaturas]
        API_REL --> REL_OP[GET /operadores]
    end

    %% ========== BANCO DE DADOS ==========
    subgraph DATABASE["🗄️ BANCO DE DADOS"]
        DB_USER[(Usuarios)]
        DB_DEN[(Denuncias)]
        DB_CASO[(Casos)]
        DB_MSG[(MensagensCaso)]
        DB_ANEXO[(AnexosDenuncia)]
        DB_VIA[(Viaturas)]
        
        DB_USER -->|1:N| DB_DEN
        DB_DEN -->|1:1| DB_CASO
        DB_CASO -->|1:N| DB_MSG
        DB_DEN -->|1:N| DB_ANEXO
        DB_VIA -->|1:N| DB_CASO
        DB_USER -->|1:N| DB_CASO
    end

    %% ========== CONEXÕES FRONT -> API ==========
    ENVIAR_DEN -.-> API_DEN
    LIST_DEN -.-> API_DEN
    CRIAR_CASO -.-> DEN_PROMOVER
    SALVAR_MSG -.-> CASO_MSG
    BTN_VINC -.-> CASO_VINC
    BTN_DESV -.-> CASO_DESV
    SAVE_ADMIN -.-> USER_NEW_ADMIN
    SAVE_VIA -.-> VIA_CREATE
    DASH_STATS -.-> API_REL
    SELECT_VIA -.-> VIA_DISP
    
    %% ========== API -> DATABASE ==========
    API_AUTH -.-> DB_USER
    API_DEN -.-> DB_DEN
    API_DEN -.-> DB_ANEXO
    API_CASOS -.-> DB_CASO
    API_CASOS -.-> DB_MSG
    API_USERS -.-> DB_USER
    API_VIA -.-> DB_VIA
    API_REL -.-> DB_DEN
    API_REL -.-> DB_CASO
    API_REL -.-> DB_VIA

    %% ========== ESTILOS ==========
    classDef acesso fill:#1a1a2e,stroke:#4a90e2,color:#fff
    classDef cidadao fill:#16213e,stroke:#2ecc71,color:#fff
    classDef operador fill:#0f3460,stroke:#e94560,color:#fff
    classDef admin fill:#533483,stroke:#f39c12,color:#fff
    classDef api fill:#1b1b2f,stroke:#00d9ff,color:#fff
    classDef database fill:#162447,stroke:#e43f5a,color:#fff
    
    class ACESSO acesso
    class CIDADAO cidadao
    class OPERADOR operador
    class ADMIN admin
    class API api
    class DATABASE database
```

---

## 📊 Resumo das Funcionalidades

### 👤 Cidadão
- Registro (apenas cidadão)
- Login/Logout
- Criar denúncias (anônimas ou identificadas)
- Upload de anexos
- Visualizar/Editar/Excluir denúncias
- Acompanhar casos
- Chat com operador

### 👷 Operador
- Login/Logout
- Visualizar denúncias pendentes (Inbox)
- Promover denúncias para casos
- Gerenciar casos
- Chat com denunciantes
- Vincular/Desvincular viaturas
- Atualizar status dos casos

### ⚙️ Administrador
- Todas as funcionalidades do Operador
- Painel de Configurações
- Gerenciar administradores
- CRUD de viaturas
- Dashboard de relatórios e estatísticas

### 🚔 Viaturas
- Cadastro com placa, identificação, tipo e status
- Vinculação a casos
- Status: Disponível, Em Atendimento, Manutenção, Inativa
- Tipos: Patrulha, Investigação, Apoio, Administrativa

### 📈 Relatórios
- Total de denúncias e casos
- Tempo médio de resposta
- Denúncias por tipo e prioridade
- Casos por status
- Viaturas mais utilizadas
- Operadores mais ativos
- Filtro por período (Hoje, Semana, Mês, Ano)

---

## 🔗 Endpoints da API

| Módulo | Endpoint | Método | Descrição |
|--------|----------|--------|-----------|
| Auth | `/api/auth/login` | POST | Login |
| Denúncias | `/api/denuncias` | GET/POST | Listar/Criar |
| Denúncias | `/api/denuncias/:id` | PUT/DELETE | Atualizar/Excluir |
| Denúncias | `/api/denuncias/:id/promover` | POST | Promover para caso |
| Casos | `/api/casos` | GET | Listar casos |
| Casos | `/api/casos/:id` | GET/PUT | Buscar/Atualizar |
| Casos | `/api/casos/:id/mensagens` | GET/POST | Mensagens |
| Casos | `/api/casos/:id/vincular-viatura` | POST | Vincular viatura |
| Casos | `/api/casos/:id/desvincular-viatura` | DELETE | Desvincular |
| Usuários | `/api/usuarios/admins` | GET | Listar admins |
| Usuários | `/api/usuarios/admin` | POST | Criar admin |
| Viaturas | `/api/viaturas` | GET/POST | Listar/Criar |
| Viaturas | `/api/viaturas/disponiveis` | GET | Disponíveis |
| Viaturas | `/api/viaturas/:id` | PUT/DELETE | Atualizar/Excluir |
| Relatórios | `/api/relatorios/dashboard` | GET | Estatísticas |

---

## 🗄️ Entidades do Banco de Dados

| Entidade | Campos Principais |
|----------|-------------------|
| **Usuario** | Id, Nome, Email, Senha, Tipo, DataCriacao |
| **Denuncia** | Id, Tipo, Local, Descrição, Prioridade, Anonima, UsuarioId |
| **Caso** | Id, CodigoCaso, Status, DataAbertura, ViaturaId, OperadorId |
| **MensagemCaso** | Id, Texto, Remetente, DataEnvio, CasoId, UsuarioId |
| **AnexoDenuncia** | Id, NomeArquivo, Caminho, DenunciaId |
| **Viatura** | Id, Placa, Identificacao, Tipo, Status, Observacoes |

---

**Sistema de Denúncias v2.0 - Diagrama Unificado**
