# 🔄 Diagrama de Fluxo do Sistema

## Fluxo Geral

```mermaid
flowchart TB
    subgraph ACESSO["🔐 Acesso"]
        A([Usuário]) --> B[Login]
        B --> C{Tipo?}
    end

    subgraph CIDADAO["👤 Cidadão"]
        C -->|Cidadão| D[UserPanel]
        D --> D1[Criar Denúncia]
        D --> D2[Ver Minhas Denúncias]
        D --> D3[Acompanhar Casos]
        D1 --> D4[Enviar para API]
    end

    subgraph OPERADOR["👷 Operador/Admin"]
        C -->|Operador/Admin| E[Dashboard]
        E --> E1[Inbox - Denúncias]
        E --> E2[Casos Abertos]
        E --> E3[Detalhes + Chat]
        E1 --> E4{Promover?}
        E4 -->|Sim| E5[Criar Caso]
        E5 --> E2
        E3 --> E6[Vincular Viatura]
        E3 --> E7[Atualizar Status]
    end

    subgraph ADMIN["⚙️ Admin Only"]
        E --> F[Configurações]
        F --> F1[Gerenciar Admins]
        F --> F2[Gerenciar Viaturas]
        F --> F3[Relatórios]
    end

    subgraph API["🖥️ Back-end"]
        G["/api/auth"]
        H["/api/denuncias"]
        I["/api/casos"]
        J["/api/viaturas"]
        K["/api/relatorios"]
    end

    subgraph DB["🗄️ Banco"]
        L[(SQLite)]
    end

    D4 -.-> H
    E1 -.-> H
    E2 -.-> I
    E6 -.-> J
    F3 -.-> K
    
    G -.-> L
    H -.-> L
    I -.-> L
    J -.-> L
    K -.-> L
```

---

## 📝 Resumo do Fluxo

### 1. Autenticação
- Usuário faz login → JWT Token gerado
- Redirecionamento baseado no tipo de usuário

### 2. Cidadão
- Cria denúncias (anônimas ou identificadas)
- Visualiza suas denúncias
- Acompanha casos e conversa com operador

### 3. Operador
- Visualiza denúncias pendentes (Inbox)
- Promove denúncias para casos
- Gerencia casos e envia mensagens via chat
- Vincula/desvincula viaturas aos casos
- Finaliza casos (libera viatura automaticamente)

### 4. Administrador
- Todas as funções do operador
- Gerencia outros administradores
- CRUD de viaturas
- Acessa relatórios e estatísticas

---

## 🔗 Principais Endpoints

| Módulo | Endpoints |
|--------|-----------|
| Auth | `POST /login` |
| Denúncias | `GET, POST, PUT, DELETE` |
| Casos | `GET, PUT, POST /{id}/mensagens, POST /{id}/vincular-viatura, POST /{id}/finalizar` |
| Viaturas | `GET, POST, PUT, DELETE, GET /disponiveis` |
| Relatórios | `GET /dashboard, GET /casos-por-status, GET /casos-por-tipo` |
