# 📋 Prompt de Desenvolvimento - Sistema de Denúncias

## 🎯 Visão Geral do Sistema

Sistema web de gerenciamento de denúncias anônimas dividido em:
- **Front-end**: React + Vite
- **Back-end**: ASP.NET Core 9.0 + MySQL
- **Autenticação**: JWT (JSON Web Tokens)

---

## 🗄️ Modelagem do Banco de Dados

### Entidades Atuais

#### **Usuario**
```csharp
public class Usuario
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Email { get; set; }
    public string SenhaHash { get; set; }
    public TipoUsuario Tipo { get; set; }  // NOVO: Diferencia Admin/Operador/Cidadão
}

public enum TipoUsuario
{
    Cidadao = 0,      // Usuário comum que faz denúncias
    Operador = 1,     // Operador que gerencia denúncias
    Administrador = 2 // Admin com acesso total
}
```

### Novas Entidades a Criar

#### **Denuncia**
```csharp
public class Denuncia
{
    public int Id { get; set; }
    public string TipoDenuncia { get; set; }        // violencia, furto, trafico, etc
    public string Prioridade { get; set; }          // alta, media, baixa
    public string Local { get; set; }
    public string Descricao { get; set; }
    public DateTime DataCriacao { get; set; }
    public string HoraCriacao { get; set; }
    public bool Anonima { get; set; }               // Se é anônima ou não
    public string CodigoAnonimo { get; set; }       // Ex: ANON_7834
    
    // Relacionamentos
    public int? UsuarioId { get; set; }             // Nullable: pode ser anônima
    public Usuario? Usuario { get; set; }
    
    public int? CasoId { get; set; }                // Nullable: pode não ter virado caso
    public Caso? Caso { get; set; }
    
    public ICollection<AnexoDenuncia> Anexos { get; set; }
}
```

#### **Caso**
```csharp
public class Caso
{
    public int Id { get; set; }
    public string CodigoCaso { get; set; }          // Ex: CASO001
    public string TipoCaso { get; set; }
    public string Prioridade { get; set; }
    public string Status { get; set; }              // aberto, em_andamento, resolvido, fechado
    public string CodigoAnonimo { get; set; }
    public DateTime DataAbertura { get; set; }
    public DateTime? DataFechamento { get; set; }
    public string Local { get; set; }
    public string Descricao { get; set; }
    
    // Relacionamentos
    public int DenunciaOrigemId { get; set; }
    public Denuncia DenunciaOrigem { get; set; }
    
    public int? OperadorResponsavelId { get; set; }
    public Usuario? OperadorResponsavel { get; set; }
    
    public ICollection<MensagemCaso> Mensagens { get; set; }
}
```

#### **MensagemCaso**
```csharp
public class MensagemCaso
{
    public int Id { get; set; }
    public string Texto { get; set; }
    public DateTime DataEnvio { get; set; }
    public string HoraEnvio { get; set; }
    public string Remetente { get; set; }           // "denunciante" ou "operador"
    
    // Relacionamentos
    public int CasoId { get; set; }
    public Caso Caso { get; set; }
    
    public int? UsuarioId { get; set; }             // Quem enviou (se não for anônimo)
    public Usuario? Usuario { get; set; }
}
```

#### **AnexoDenuncia**
```csharp
public class AnexoDenuncia
{
    public int Id { get; set; }
    public string TipoAnexo { get; set; }           // audio, foto, video
    public string CaminhoArquivo { get; set; }
    public string NomeArquivo { get; set; }
    public long TamanhoBytes { get; set; }
    public DateTime DataUpload { get; set; }
    
    // Relacionamentos
    public int DenunciaId { get; set; }
    public Denuncia Denuncia { get; set; }
}
```

---

## 🔄 Fluxo do Sistema

### 1. **Fluxo de Autenticação**
```
Usuário → Login → Validação → JWT Token → Redirecionamento
                                              ↓
                                    ┌─────────┴─────────┐
                                    ↓                   ↓
                            Cidadão (Tela User)   Operador/Admin (Dashboard)
```

### 2. **Fluxo de Denúncia (Cidadão)**
```
Tela Usuário → Cadastrar Denúncia → Preencher Formulário
                                            ↓
                                    Adicionar Anexos (opcional)
                                            ↓
                                    Escolher Anonimato
                                            ↓
                                    Enviar → Salvar no BD
                                            ↓
                                    Gerar Código de Acompanhamento
```

### 3. **Fluxo de Gerenciamento (Operador/Admin)**
```
Dashboard → Inbox (Novas Denúncias) → Promover para Caso
                                            ↓
                                    Painel de Casos → Selecionar Caso
                                            ↓
                                    Chat com Denunciante
                                            ↓
                                    Atualizar Status → Resolver/Fechar
```

---

## 🎨 Estrutura do Front-end (REORGANIZADA)

### Nova Estrutura de Pastas
```
site/
├── public/
│   └── assets/
│       └── images/
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
│   │   ├── auth/                # Componentes de autenticação
│   │   │   ├── Login/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Login.css
│   │   │   └── Registro/
│   │   │       ├── Registro.jsx
│   │   │       └── Registro.css
│   │   │
│   │   ├── dashboard/           # Painel administrativo
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard.css
│   │   │   ├── InboxPanel/
│   │   │   │   ├── InboxPanel.jsx
│   │   │   │   └── InboxPanel.css
│   │   │   ├── CasosPanel/
│   │   │   │   ├── CasosPanel.jsx
│   │   │   │   └── CasosPanel.css
│   │   │   └── DetailPanel/
│   │   │       ├── DetailPanel.jsx
│   │   │       └── DetailPanel.css
│   │   │
│   │   ├── user/                # Tela do usuário cidadão
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
│   │   ├── authService.js
│   │   ├── denunciaService.js   # NOVO
│   │   ├── casoService.js       # NOVO
│   │   └── api.js               # Cliente HTTP base
│   │
│   ├── utils/                   # Utilitários
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   ├── hooks/                   # Custom hooks
│   │   └── useAuth.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
│
├── data/                        # REMOVER após integração
│   └── mockData.js
│
├── index.html
├── package.json
└── vite.config.js
```

---

## 🛠️ Tarefas de Desenvolvimento

### **FASE 1: Back-end - Novas Entidades e Migrations**

#### 1.1 Atualizar Model Usuario
```csharp
// Adicionar enum TipoUsuario
// Adicionar propriedade Tipo no Usuario.cs
```

#### 1.2 Criar Models
- [ ] `Denuncia.cs`
- [ ] `Caso.cs`
- [ ] `MensagemCaso.cs`
- [ ] `AnexoDenuncia.cs`

#### 1.3 Atualizar AppDbContext
```csharp
public DbSet<Denuncia> Denuncias => Set<Denuncia>();
public DbSet<Caso> Casos => Set<Caso>();
public DbSet<MensagemCaso> MensagensCaso => Set<MensagemCaso>();
public DbSet<AnexoDenuncia> AnexosDenuncia => Set<AnexoDenuncia>();

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Configurar relacionamentos
    // Configurar índices
    // Configurar constraints
}
```

#### 1.4 Criar DTOs
- [ ] `CadastrarDenunciaRequest.cs`
- [ ] `AtualizarDenunciaRequest.cs`
- [ ] `DenunciaResponse.cs`
- [ ] `CriarCasoRequest.cs`
- [ ] `AtualizarCasoRequest.cs`
- [ ] `CasoResponse.cs`
- [ ] `EnviarMensagemRequest.cs`

#### 1.5 Criar Endpoints
- [ ] `DenunciasEndpoints.cs`
  - GET /api/denuncias (listar todas - admin/operador)
  - GET /api/denuncias/{id} (buscar por ID)
  - GET /api/denuncias/minhas (denúncias do usuário logado)
  - POST /api/denuncias (criar denúncia)
  - PUT /api/denuncias/{id} (atualizar)
  - DELETE /api/denuncias/{id} (deletar)
  - POST /api/denuncias/{id}/promover (promover para caso)

- [ ] `CasosEndpoints.cs`
  - GET /api/casos (listar todos)
  - GET /api/casos/{id} (buscar por ID)
  - PUT /api/casos/{id} (atualizar status)
  - DELETE /api/casos/{id} (deletar)
  - POST /api/casos/{id}/mensagens (enviar mensagem)
  - GET /api/casos/{id}/mensagens (listar mensagens)

#### 1.6 Criar Migration
```bash
dotnet ef migrations add AdicionarSistemaDenuncias
dotnet ef database update
```

#### 1.7 Atualizar DbInitializer
- Adicionar seed de denúncias de teste
- Adicionar seed de casos de teste
- Atualizar usuários com tipos diferentes

---

### **FASE 2: Front-end - Reorganização**

#### 2.1 Criar Nova Estrutura de Pastas
- [ ] Criar pasta `src/components/common/`
- [ ] Criar pasta `src/components/auth/`
- [ ] Criar pasta `src/components/dashboard/`
- [ ] Criar pasta `src/components/user/`
- [ ] Criar pasta `src/components/home/`
- [ ] Criar pasta `src/services/`
- [ ] Criar pasta `src/utils/`
- [ ] Criar pasta `src/hooks/`

#### 2.2 Mover Componentes Existentes
- [ ] Mover `Login` para `src/components/auth/Login/`
- [ ] Mover `Registro` para `src/components/auth/Registro/`
- [ ] Mover `Home` para `src/components/home/`
- [ ] Mover `Dashboard` para `src/components/dashboard/`
- [ ] Mover `Topbar` para `src/components/common/Topbar/`
- [ ] Mover `Taskbar` para `src/components/common/Taskbar/`
- [ ] Mover `InboxPanel` para `src/components/dashboard/InboxPanel/`
- [ ] Mover `CasosPanel` para `src/components/dashboard/CasosPanel/`
- [ ] Mover `DetailPanel` para `src/components/dashboard/DetailPanel/`
- [ ] Mover `MainSystem` para `src/components/dashboard/`

#### 2.3 Atualizar Imports
- [ ] Atualizar todos os imports nos componentes movidos
- [ ] Atualizar imports no `App.jsx`

---

### **FASE 3: Front-end - Novos Componentes**

#### 3.1 Criar Serviços
```javascript
// src/services/denunciaService.js
export const denunciaService = {
  listar: async () => {},
  buscarPorId: async (id) => {},
  minhasDenuncias: async () => {},
  criar: async (dados) => {},
  atualizar: async (id, dados) => {},
  deletar: async (id) => {},
  promoverParaCaso: async (id) => {}
}

// src/services/casoService.js
export const casoService = {
  listar: async () => {},
  buscarPorId: async (id) => {},
  atualizar: async (id, dados) => {},
  enviarMensagem: async (casoId, mensagem) => {},
  listarMensagens: async (casoId) => {}
}
```

#### 3.2 Criar Componente UserPanel
```jsx
// src/components/user/UserPanel/UserPanel.jsx
// Tela principal do usuário cidadão
// - Formulário de nova denúncia
// - Lista de denúncias do usuário
// - Acompanhamento de casos
```

#### 3.3 Criar Componente DenunciaForm
```jsx
// src/components/user/DenunciaForm/DenunciaForm.jsx
// Formulário completo de denúncia
// - Tipo de denúncia (select)
// - Local (input)
// - Descrição (textarea)
// - Prioridade (select)
// - Upload de anexos
// - Checkbox anonimato
```

#### 3.4 Criar Componente MinhasDenuncias
```jsx
// src/components/user/MinhasDenuncias/MinhasDenuncias.jsx
// Lista de denúncias do usuário
// - Card para cada denúncia
// - Status da denúncia
// - Opção de editar/deletar
```

---

### **FASE 4: Integração e Testes**

#### 4.1 Integrar Front com Back
- [ ] Remover `mockData.js`
- [ ] Atualizar `MainSystem` para usar API real
- [ ] Atualizar `InboxPanel` para usar API real
- [ ] Atualizar `CasosPanel` para usar API real
- [ ] Implementar `UserPanel` com API real

#### 4.2 Implementar Autorização por Tipo de Usuário
```javascript
// Redirecionar baseado no tipo de usuário após login
if (user.tipo === 'Administrador' || user.tipo === 'Operador') {
  navigate('/dashboard');
} else {
  navigate('/user');
}
```

#### 4.3 Testes
- [ ] Testar CRUD de denúncias
- [ ] Testar criação de casos
- [ ] Testar chat entre operador e denunciante
- [ ] Testar upload de anexos
- [ ] Testar diferentes tipos de usuário

---

## 🔐 Regras de Negócio

### Permissões por Tipo de Usuário

| Funcionalidade | Cidadão | Operador | Admin |
|----------------|---------|----------|-------|
| Criar denúncia | ✅ | ✅ | ✅ |
| Ver próprias denúncias | ✅ | ✅ | ✅ |
| Ver todas denúncias | ❌ | ✅ | ✅ |
| Promover para caso | ❌ | ✅ | ✅ |
| Gerenciar casos | ❌ | ✅ | ✅ |
| Gerenciar usuários | ❌ | ❌ | ✅ |
| Deletar denúncias | Próprias | Todas | Todas |

### Validações

#### Denúncia
- Local: obrigatório, mínimo 10 caracteres
- Descrição: obrigatório, mínimo 20 caracteres
- Tipo: obrigatório (violencia, furto, trafico, vandalismo, outros)
- Prioridade: obrigatório (alta, media, baixa)
- Anexos: opcional, máximo 5 arquivos, 10MB cada

#### Caso
- Só pode ser criado a partir de uma denúncia
- Status inicial: "aberto"
- Código gerado automaticamente: CASO + timestamp
- Código anônimo herdado da denúncia

---

## 📊 Endpoints da API

### Denúncias

```http
GET    /api/denuncias              # Listar todas (admin/operador)
GET    /api/denuncias/{id}         # Buscar por ID
GET    /api/denuncias/minhas       # Minhas denúncias (usuário logado)
POST   /api/denuncias              # Criar denúncia
PUT    /api/denuncias/{id}         # Atualizar denúncia
DELETE /api/denuncias/{id}         # Deletar denúncia
POST   /api/denuncias/{id}/promover # Promover para caso
```

### Casos

```http
GET    /api/casos                  # Listar todos
GET    /api/casos/{id}             # Buscar por ID
PUT    /api/casos/{id}             # Atualizar status
DELETE /api/casos/{id}             # Deletar caso
POST   /api/casos/{id}/mensagens   # Enviar mensagem
GET    /api/casos/{id}/mensagens   # Listar mensagens
```

### Usuários (já existente)

```http
GET    /api/usuarios               # Listar todos
GET    /api/usuarios/{id}          # Buscar por ID
POST   /api/usuarios               # Criar usuário
PUT    /api/usuarios/{id}          # Atualizar usuário
DELETE /api/usuarios/{id}          # Deletar usuário
```

### Autenticação (já existente)

```http
POST   /api/auth/login             # Login
```

---

## 🎨 Padrão de Cores e Layout

### Cores do Sistema
```css
/* Prioridades */
--alta: #ef4444
--media: #f59e0b
--baixa: #10b981

/* Tipos de Denúncia */
--violencia: #dc2626
--furto: #f59e0b
--trafico: #7c3aed
--vandalismo: #0891b2
--outros: #6b7280

/* Status */
--aberto: #3b82f6
--em-andamento: #f59e0b
--resolvido: #10b981
--fechado: #6b7280
```

### Layout
- Seguir o mesmo padrão visual do `MainSystem` (Dashboard de operador)
- Usar grid responsivo
- Cards com sombras suaves
- Animações de entrada
- Feedback visual para ações

---

## 📝 Checklist Final

### Back-end
- [ ] Models criados
- [ ] DTOs criados
- [ ] Endpoints implementados
- [ ] Migration executada
- [ ] Seed de dados atualizado
- [ ] Validações implementadas
- [ ] Autorização por tipo de usuário

### Front-end
- [ ] Estrutura reorganizada
- [ ] Componentes movidos
- [ ] Imports atualizados
- [ ] Serviços criados
- [ ] UserPanel implementado
- [ ] Integração com API
- [ ] mockData.js removido
- [ ] Roteamento por tipo de usuário

### Testes
- [ ] CRUD de denúncias funcionando
- [ ] CRUD de casos funcionando
- [ ] Chat funcionando
- [ ] Upload de anexos funcionando
- [ ] Permissões validadas
- [ ] Responsividade testada

---

## 🚀 Comandos Úteis

### Back-end
```bash
# Criar migration
dotnet ef migrations add NomeDaMigration

# Aplicar migration
dotnet ef database update

# Reverter migration
dotnet ef migrations remove

# Rodar aplicação
dotnet run

# Rodar com hot reload
dotnet watch run
```

### Front-end
```bash
# Instalar dependências
npm install

# Rodar dev server
npm run dev

# Build para produção
npm run build

# Preview build
npm run preview
```

---

**Desenvolvido para Sistema de Denúncias Anônimas**
