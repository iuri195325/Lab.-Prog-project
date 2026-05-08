# Especificação de Novas Funcionalidades - Sistema de Denúncias

**Data de Criação**: 07/05/2026  
**Versão**: 1.0  
**Status**: Em Desenvolvimento

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Feature 1: Painel de Configurações Administrativas](#feature-1-painel-de-configurações-administrativas)
3. [Feature 2: Cadastro de Administradores](#feature-2-cadastro-de-administradores)
4. [Feature 3: Gerenciamento de Viaturas](#feature-3-gerenciamento-de-viaturas)
5. [Feature 4: Vinculação de Casos a Viaturas](#feature-4-vinculação-de-casos-a-viaturas)
6. [Feature 5: Sistema de Chat Persistente](#feature-5-sistema-de-chat-persistente)
7. [Feature 6: Relatórios e Estatísticas](#feature-6-relatórios-e-estatísticas)
8. [Feature 7: Ajuste no Registro de Usuários](#feature-7-ajuste-no-registro-de-usuários)
9. [Modelo de Dados](#modelo-de-dados)
10. [Arquitetura e Organização](#arquitetura-e-organização)

---

## Visão Geral

Este documento especifica as novas funcionalidades que serão implementadas no Sistema de Denúncias para melhorar a gestão administrativa, operacional e de relatórios.

### Objetivos Principais

- Permitir que administradores gerenciem outros administradores
- Implementar sistema de gerenciamento de viaturas
- Vincular casos a viaturas para melhor rastreamento
- Garantir persistência do sistema de chat
- Fornecer relatórios e estatísticas do sistema
- Separar claramente o registro de cidadãos do cadastro de administradores

---

## Feature 1: Painel de Configurações Administrativas

### Descrição
Criar uma nova seção no sistema administrativo chamada "Configurações" (ou "Administração") acessível apenas para usuários com tipo `Administrador`.

### User Story
```
Como administrador do sistema
Quero acessar um painel de configurações
Para gerenciar administradores, viaturas e visualizar relatórios
```

### Critérios de Aceitação
- [ ] Botão "Configurações" visível apenas para administradores
- [ ] Botão posicionado na topbar ou sidebar do MainSystem
- [ ] Ao clicar, abre painel com abas/seções:
  - Gerenciar Administradores
  - Gerenciar Viaturas
  - Relatórios
- [ ] Navegação clara entre as seções
- [ ] Design consistente com o restante do sistema

### Implementação Técnica

#### Front-end
- **Localização**: `site/site/src/assets/Componentes/ConfigPanel/`
- **Componentes**:
  - `ConfigPanel.jsx` - Container principal
  - `ConfigPanel.css` - Estilos
  - `AdminManager.jsx` - Gerenciamento de admins
  - `ViaturaManager.jsx` - Gerenciamento de viaturas
  - `ReportsPanel.jsx` - Relatórios

#### Estrutura do ConfigPanel
```jsx
<ConfigPanel>
  <Sidebar>
    - Gerenciar Administradores
    - Gerenciar Viaturas
    - Relatórios
  </Sidebar>
  <MainContent>
    {activeTab === 'admins' && <AdminManager />}
    {activeTab === 'viaturas' && <ViaturaManager />}
    {activeTab === 'reports' && <ReportsPanel />}
  </MainContent>
</ConfigPanel>
```

---

## Feature 2: Cadastro de Administradores

### Descrição
Permitir que administradores cadastrem novos administradores através do painel de configurações.

### User Story
```
Como administrador do sistema
Quero cadastrar novos administradores
Para expandir a equipe de gestão do sistema
```

### Critérios de Aceitação
- [ ] Formulário de cadastro com campos:
  - Nome completo (obrigatório)
  - Email (obrigatório, único)
  - Senha (obrigatório, mínimo 6 caracteres)
  - Confirmação de senha
- [ ] Validação de email único
- [ ] Senha deve ser hasheada com BCrypt
- [ ] Tipo de usuário automaticamente definido como `Administrador`
- [ ] Lista de administradores cadastrados
- [ ] Opção de desativar/ativar administrador (não excluir)
- [ ] Feedback visual de sucesso/erro

### Implementação Técnica

#### Back-end
- **Endpoint**: `POST /api/usuarios/admin`
- **Autorização**: Apenas `Administrador`
- **Request Body**:
```json
{
  "nome": "string",
  "email": "string",
  "senha": "string"
}
```
- **Response**: `201 Created` com dados do admin criado (sem senha)

#### Endpoint Adicional
- `GET /api/usuarios/admins` - Listar todos os administradores
- `PUT /api/usuarios/admin/{id}/status` - Ativar/desativar admin

#### Front-end
- **Service**: `site/site/src/services/adminService.js`
- **Componente**: `AdminManager.jsx`

---

## Feature 3: Gerenciamento de Viaturas

### Descrição
Sistema completo de CRUD para gerenciar viaturas que podem ser vinculadas a casos.

### User Story
```
Como administrador do sistema
Quero cadastrar e gerenciar viaturas
Para poder vinculá-las a casos e acompanhar seu status
```

### Critérios de Aceitação
- [ ] Formulário de cadastro de viatura com campos:
  - Placa (obrigatório, único, formato ABC-1234)
  - Identificação/Código (ex: VTR-001)
  - Tipo (Patrulha, Resgate, Investigação)
  - Status (Disponível, Em Atendimento, Manutenção, Indisponível)
  - Observações (opcional)
- [ ] Lista de viaturas cadastradas
- [ ] Filtros por status e tipo
- [ ] Editar viatura
- [ ] Excluir viatura (apenas se não estiver vinculada a casos ativos)
- [ ] Indicador visual do status da viatura

### Implementação Técnica

#### Back-end

##### Entidade Viatura
```csharp
public class Viatura
{
    public int Id { get; set; }
    public string Placa { get; set; } // ABC-1234
    public string Identificacao { get; set; } // VTR-001
    public string Tipo { get; set; } // Patrulha, Resgate, Investigação
    public string Status { get; set; } // Disponível, Em Atendimento, Manutenção, Indisponível
    public string? Observacoes { get; set; }
    public DateTime DataCadastro { get; set; }
    
    // Relacionamentos
    public ICollection<Caso> Casos { get; set; }
}
```

##### Endpoints
- `GET /api/viaturas` - Listar todas
- `GET /api/viaturas/{id}` - Buscar por ID
- `GET /api/viaturas/disponiveis` - Listar apenas disponíveis
- `POST /api/viaturas` - Criar viatura
- `PUT /api/viaturas/{id}` - Atualizar viatura
- `DELETE /api/viaturas/{id}` - Excluir viatura
- `PUT /api/viaturas/{id}/status` - Atualizar apenas status

##### DTOs
```csharp
public class ViaturaRequest
{
    public string Placa { get; set; }
    public string Identificacao { get; set; }
    public string Tipo { get; set; }
    public string Status { get; set; }
    public string? Observacoes { get; set; }
}

public class ViaturaResponse
{
    public int Id { get; set; }
    public string Placa { get; set; }
    public string Identificacao { get; set; }
    public string Tipo { get; set; }
    public string Status { get; set; }
    public string? Observacoes { get; set; }
    public DateTime DataCadastro { get; set; }
    public int CasosAtivos { get; set; }
}
```

#### Front-end
- **Service**: `site/site/src/services/viaturaService.js`
- **Componente**: `ViaturaManager.jsx`
- **Constantes**: Adicionar em `constants.js`:
  - `TIPOS_VIATURA`
  - `STATUS_VIATURA`

---

## Feature 4: Vinculação de Casos a Viaturas

### Descrição
Permitir que operadores/administradores vinculem casos a viaturas disponíveis.

### User Story
```
Como operador do sistema
Quero vincular um caso a uma viatura
Para que a equipe possa atender a ocorrência
```

### Critérios de Aceitação
- [ ] Botão "Encaminhar para Viatura" no painel de detalhes do caso
- [ ] Modal/dropdown para selecionar viatura disponível
- [ ] Mostrar informações da viatura (placa, identificação, tipo)
- [ ] Ao vincular:
  - Status do caso muda para "Em Atendimento"
  - Status da viatura muda para "Em Atendimento"
  - Registro de data/hora da vinculação
  - Operador responsável pela vinculação
- [ ] Exibir viatura vinculada no painel do caso
- [ ] Permitir desvincular viatura (caso necessário)
- [ ] Histórico de vinculações

### Implementação Técnica

#### Back-end

##### Atualização da Entidade Caso
```csharp
public class Caso
{
    // ... campos existentes
    public int? ViaturaId { get; set; }
    public Viatura? Viatura { get; set; }
    public DateTime? DataVinculacaoViatura { get; set; }
    public int? UsuarioVinculacaoViaturaId { get; set; }
    public Usuario? UsuarioVinculacaoViatura { get; set; }
}
```

##### Endpoints
- `POST /api/casos/{id}/vincular-viatura` - Vincular viatura ao caso
- `DELETE /api/casos/{id}/desvincular-viatura` - Desvincular viatura
- `GET /api/casos/{id}/historico-viaturas` - Histórico de vinculações

##### Request/Response
```csharp
public class VincularViaturaRequest
{
    public int ViaturaId { get; set; }
}

// CasoResponse atualizado para incluir:
public class CasoResponse
{
    // ... campos existentes
    public ViaturaSimples? Viatura { get; set; }
    public DateTime? DataVinculacaoViatura { get; set; }
}

public class ViaturaSimples
{
    public int Id { get; set; }
    public string Placa { get; set; }
    public string Identificacao { get; set; }
    public string Status { get; set; }
}
```

#### Front-end
- Atualizar `CasosPanel.jsx` para mostrar viatura vinculada
- Adicionar modal de seleção de viatura
- Atualizar `casoService.js` com novos endpoints

---

## Feature 5: Sistema de Chat Persistente

### Descrição
Garantir que o sistema de chat entre operadores e denunciantes esteja totalmente funcional e persistente.

### User Story
```
Como operador do sistema
Quero conversar com o denunciante através do chat
Para obter mais informações sobre o caso
```

### Critérios de Aceitação
- [ ] Chat funcional no painel de detalhes do caso
- [ ] Mensagens salvas no banco de dados
- [ ] Identificação clara de quem enviou (operador ou denunciante)
- [ ] Data e hora de cada mensagem
- [ ] Scroll automático para última mensagem
- [ ] Indicador de "digitando..." (opcional)
- [ ] Histórico completo de mensagens
- [ ] Notificação visual de nova mensagem

### Implementação Técnica

#### Back-end
**Nota**: A entidade `MensagemCaso` já existe. Verificar se os endpoints estão completos.

##### Endpoints Necessários
- `GET /api/casos/{id}/mensagens` - Listar mensagens do caso
- `POST /api/casos/{id}/mensagens` - Enviar mensagem
- `GET /api/casos/{id}/mensagens/novas` - Buscar mensagens novas (polling)

##### Entidade MensagemCaso (já existe)
```csharp
public class MensagemCaso
{
    public int Id { get; set; }
    public string Texto { get; set; }
    public string Remetente { get; set; } // "operador" ou "denunciante"
    public string HoraEnvio { get; set; }
    public DateTime DataEnvio { get; set; }
    public int CasoId { get; set; }
    public Caso Caso { get; set; }
    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; }
}
```

#### Front-end
- Verificar se `ChatPanel.jsx` está funcional
- Implementar polling ou WebSocket para mensagens em tempo real
- Atualizar `casoService.js` se necessário

---

## Feature 6: Relatórios e Estatísticas

### Descrição
Painel de relatórios com estatísticas e métricas do sistema.

### User Story
```
Como administrador do sistema
Quero visualizar relatórios e estatísticas
Para acompanhar o desempenho e tomar decisões
```

### Critérios de Aceitação
- [ ] Painel de relatórios acessível em Configurações
- [ ] Filtros por período (hoje, semana, mês, personalizado)
- [ ] Métricas exibidas:
  - Total de denúncias (por período)
  - Total de casos (por período)
  - Denúncias por tipo (gráfico ou tabela)
  - Denúncias por prioridade
  - Casos por status
  - Tempo médio de resposta
  - Viaturas mais utilizadas
  - Operadores mais ativos
- [ ] Cards com números grandes e claros
- [ ] Sem exportação (apenas visualização)

### Implementação Técnica

#### Back-end

##### Endpoints
- `GET /api/relatorios/dashboard` - Estatísticas gerais
- `GET /api/relatorios/denuncias` - Relatório de denúncias
- `GET /api/relatorios/casos` - Relatório de casos
- `GET /api/relatorios/viaturas` - Relatório de viaturas
- `GET /api/relatorios/operadores` - Relatório de operadores

##### Query Parameters
```
?dataInicio=2026-01-01&dataFim=2026-12-31
```

##### Response Example (Dashboard)
```json
{
  "totalDenuncias": 150,
  "totalCasos": 45,
  "denunciasPorTipo": {
    "violencia": 30,
    "furto": 50,
    "trafico": 20,
    "vandalismo": 25,
    "perturbacao": 15,
    "outros": 10
  },
  "denunciasPorPrioridade": {
    "alta": 40,
    "media": 70,
    "baixa": 40
  },
  "casosPorStatus": {
    "aberto": 10,
    "em_andamento": 25,
    "resolvido": 8,
    "fechado": 2
  },
  "tempoMedioResposta": "2.5 horas",
  "viaturasMaisUtilizadas": [
    { "identificacao": "VTR-001", "casosAtendidos": 15 },
    { "identificacao": "VTR-002", "casosAtendidos": 12 }
  ],
  "operadoresMaisAtivos": [
    { "nome": "Carlos Operador", "casosGerenciados": 20 },
    { "nome": "Ana Operadora", "casosGerenciados": 18 }
  ]
}
```

#### Front-end
- **Componente**: `ReportsPanel.jsx`
- **Service**: `relatorioService.js`
- Cards com números grandes
- Tabelas simples para rankings
- Filtros de período

---

## Feature 7: Ajuste no Registro de Usuários

### Descrição
Modificar a tela de registro para cadastrar apenas cidadãos (denunciantes).

### User Story
```
Como visitante do sistema
Quero me registrar como cidadão
Para poder fazer denúncias
```

### Critérios de Aceitação
- [ ] Tela de registro acessível publicamente
- [ ] Formulário com campos:
  - Nome completo
  - Email
  - Senha
  - Confirmação de senha
- [ ] Tipo de usuário automaticamente definido como `Cidadao`
- [ ] Remover qualquer opção de escolher tipo de usuário
- [ ] Validações de email único e senha forte
- [ ] Após registro, redirecionar para login

### Implementação Técnica

#### Back-end
- Verificar endpoint `POST /api/auth/register`
- Garantir que sempre cria usuário com `Tipo = TipoUsuario.Cidadao`
- Remover qualquer parâmetro de tipo do request

#### Front-end
- Atualizar `Register.jsx` para remover seleção de tipo
- Simplificar formulário
- Atualizar textos para deixar claro que é para cidadãos

---

## Modelo de Dados

### Diagrama ER Atualizado

```
Usuario (já existe)
├── Id
├── Nome
├── Email
├── SenhaHash
├── Tipo (Administrador, Operador, Cidadao)
└── DataCriacao

Viatura (NOVA)
├── Id
├── Placa
├── Identificacao
├── Tipo
├── Status
├── Observacoes
└── DataCadastro

Denuncia (já existe)
├── Id
├── TipoDenuncia
├── Prioridade
├── Local
├── Descricao
├── CodigoAnonimo
├── Anonima
├── UsuarioId (FK)
├── CasoId (FK, nullable)
├── DataCriacao
└── HoraCriacao

Caso (atualizado)
├── Id
├── CodigoCaso
├── TipoCaso
├── Prioridade
├── Status
├── CodigoAnonimo
├── Local
├── Descricao
├── DenunciaOrigemId (FK)
├── OperadorResponsavelId (FK)
├── ViaturaId (FK, nullable) ← NOVO
├── DataVinculacaoViatura ← NOVO
├── UsuarioVinculacaoViaturaId (FK, nullable) ← NOVO
├── DataCriacao
└── HoraCriacao

MensagemCaso (já existe)
├── Id
├── Texto
├── Remetente
├── HoraEnvio
├── DataEnvio
├── CasoId (FK)
└── UsuarioId (FK)
```

### Relacionamentos

- `Usuario 1:N Denuncia` (um usuário pode ter várias denúncias)
- `Usuario 1:N Caso` (um operador pode gerenciar vários casos)
- `Usuario 1:N MensagemCaso` (um usuário pode enviar várias mensagens)
- `Denuncia 1:1 Caso` (uma denúncia pode virar um caso)
- `Caso 1:N MensagemCaso` (um caso pode ter várias mensagens)
- `Caso N:1 Viatura` (vários casos podem ser atendidos por uma viatura)
- `Viatura 1:N Caso` (uma viatura pode atender vários casos)

---

## Arquitetura e Organização

### Back-end

#### Estrutura de Pastas
```
back-end/
├── Domain/
│   ├── Entities/
│   │   ├── Usuario.cs
│   │   ├── Denuncia.cs
│   │   ├── Caso.cs
│   │   ├── MensagemCaso.cs
│   │   ├── AnexoDenuncia.cs
│   │   └── Viatura.cs ← NOVO
│   └── Enums/
│       ├── TipoUsuario.cs
│       ├── TipoViatura.cs ← NOVO
│       └── StatusViatura.cs ← NOVO
├── Data/
│   ├── AppDbContext.cs (atualizar com DbSet<Viatura>)
│   └── DbInitializer.cs (adicionar seed de viaturas)
├── DTOs/
│   ├── UsuarioDto.cs
│   ├── DenunciaDto.cs
│   ├── CasoDto.cs (atualizar)
│   ├── ViaturaDto.cs ← NOVO
│   └── RelatorioDto.cs ← NOVO
├── Endpoints/
│   ├── AuthEndpoints.cs (atualizar register)
│   ├── UsuariosEndpoints.cs (adicionar endpoint de admin)
│   ├── DenunciasEndpoints.cs
│   ├── CasosEndpoints.cs (atualizar com vinculação)
│   ├── ViaturasEndpoints.cs ← NOVO
│   └── RelatoriosEndpoints.cs ← NOVO
├── Services/
│   ├── JwtService.cs
│   └── RelatorioService.cs ← NOVO (lógica de cálculos)
└── Migrations/
    └── [timestamp]_AdicionarViaturas.cs ← NOVA
```

#### Princípios
- **Separação de Responsabilidades**: Cada endpoint cuida de uma entidade
- **DTOs**: Nunca expor entidades diretamente
- **Autorização**: Usar `[Authorize]` e verificar `TipoUsuario`
- **Validação**: Validar dados antes de salvar
- **Nomenclatura**: Usar camelCase no JSON (já configurado)

### Front-end

#### Estrutura de Pastas
```
site/site/src/
├── assets/
│   └── Componentes/
│       ├── Home/
│       ├── Login/
│       ├── Register/ (atualizar)
│       ├── MainSystem/
│       └── ConfigPanel/ ← NOVO
│           ├── ConfigPanel.jsx
│           ├── ConfigPanel.css
│           ├── AdminManager.jsx
│           ├── AdminManager.css
│           ├── ViaturaManager.jsx
│           ├── ViaturaManager.css
│           ├── ReportsPanel.jsx
│           └── ReportsPanel.css
├── components/
│   └── user/
│       ├── UserPanel/
│       ├── DenunciaForm/
│       └── MinhasDenuncias/
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── denunciaService.js
│   ├── casoService.js
│   ├── adminService.js ← NOVO
│   ├── viaturaService.js ← NOVO
│   └── relatorioService.js ← NOVO
├── utils/
│   └── constants.js (adicionar constantes de viatura)
└── hooks/
    └── useAuth.js
```

#### Princípios
- **Componentização**: Componentes pequenos e reutilizáveis
- **Services**: Toda comunicação com API via services
- **Consistência Visual**: Seguir padrão do MainSystem
- **Responsividade**: Mobile-friendly
- **Feedback**: Toast para sucesso/erro

---

## Ordem de Implementação Sugerida

### Fase 1: Back-end Base
1. Criar entidade `Viatura`
2. Criar migration para adicionar tabela `Viaturas`
3. Atualizar `AppDbContext` com `DbSet<Viatura>`
4. Criar DTOs de Viatura
5. Criar `ViaturasEndpoints.cs` com CRUD completo
6. Atualizar entidade `Caso` com campos de viatura
7. Criar migration para atualizar tabela `Casos`
8. Atualizar `CasosEndpoints.cs` com vinculação de viatura

### Fase 2: Back-end Relatórios e Admin
9. Criar `RelatoriosEndpoints.cs`
10. Implementar lógica de cálculo de estatísticas
11. Atualizar `UsuariosEndpoints.cs` para cadastro de admin
12. Atualizar `AuthEndpoints.cs` para registro apenas de cidadãos

### Fase 3: Front-end Configurações
13. Criar estrutura de `ConfigPanel`
14. Implementar `AdminManager` (cadastro de admins)
15. Implementar `ViaturaManager` (CRUD de viaturas)
16. Implementar `ReportsPanel` (visualização de relatórios)
17. Adicionar botão de acesso ao ConfigPanel no MainSystem

### Fase 4: Front-end Vinculação e Ajustes
18. Atualizar `CasosPanel` para mostrar viatura vinculada
19. Adicionar modal de vinculação de viatura
20. Verificar e ajustar sistema de chat
21. Atualizar tela de registro para apenas cidadãos

### Fase 5: Testes e Refinamentos
22. Testar todos os fluxos
23. Ajustar estilos e UX
24. Adicionar validações faltantes
25. Documentar endpoints (opcional: Swagger)

---

## Considerações de Segurança

- Apenas administradores podem acessar ConfigPanel
- Validar permissões em todos os endpoints sensíveis
- Não expor senhas em nenhuma resposta
- Validar dados de entrada (SQL Injection, XSS)
- Limitar taxa de requisições (rate limiting) - opcional

---

## Considerações de Performance

- Indexar campos de busca frequente (Placa, Email, CodigoCaso)
- Paginar listas grandes (viaturas, admins, relatórios)
- Cache de estatísticas (opcional)
- Otimizar queries com Include/Select

---

## Melhorias Futuras (Fora do Escopo Atual)

- WebSocket para chat em tempo real
- Notificações push
- Mapa com localização de viaturas
- Exportação de relatórios (CSV/PDF)
- Dashboard com gráficos interativos
- Histórico completo de ações (audit log)
- Anexos em mensagens de chat
- Sistema de permissões granular

---

## Glossário

- **Viatura**: Veículo operacional usado para atender casos
- **Vinculação**: Ação de associar um caso a uma viatura
- **Denunciante**: Cidadão que registra uma denúncia
- **Operador**: Usuário que gerencia casos
- **Administrador**: Usuário com acesso total ao sistema
- **Caso**: Denúncia promovida para investigação/atendimento

---

**Fim da Especificação**
