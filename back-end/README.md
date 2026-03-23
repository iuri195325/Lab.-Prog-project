# Back-End API - Guia de Instalação

API REST desenvolvida em ASP.NET Core 9.0 com autenticação JWT e MySQL.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/) (opcional)

## 🚀 Instalação e Configuração

### 1. Clone ou baixe o projeto

```bash
# Se estiver usando Git
git clone <url-do-repositorio>
cd back-end

# Ou apenas extraia o arquivo ZIP na pasta desejada
```

### 2. Inicie o Docker Desktop

Certifique-se de que o Docker Desktop está **rodando** antes de continuar.

### 3. Suba o container MySQL

No terminal, dentro da pasta do projeto, execute:

```bash
docker-compose up -d
```

Este comando irá:
- Baixar a imagem do MySQL 8.0 (se necessário)
- Criar um container chamado `backend-mysql`
- Configurar o banco de dados `BackEndDb`
- Expor o MySQL na porta **3307**

### 4. Restaure os pacotes NuGet

```bash
dotnet restore
```

### 5. Execute as migrations (se necessário)

As migrations são aplicadas automaticamente ao iniciar a aplicação, mas você pode executar manualmente:

```bash
dotnet ef database update
```

### 6. Inicie a aplicação

```bash
dotnet run
```

A API estará disponível em: **http://localhost:5242**

## 👤 Usuários de Teste

A aplicação cria automaticamente 4 usuários para teste:

| Email | Senha |
|-------|-------|
| `admin@example.com` | `admin123` |
| `joao@example.com` | `senha123` |
| `maria@example.com` | `senha123` |
| `pedro@example.com` | `senha123` |

## 📡 Endpoints Disponíveis

### Autenticação (Público)

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "senha": "admin123"
}
```

**Resposta de sucesso:**
```json
{
  "message": "Login realizado com sucesso",
  "data": {
    "id": 1,
    "nome": "Admin",
    "email": "admin@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Usuários

#### Cadastrar novo usuário (Público)
```http
POST /api/usuarios
Content-Type: application/json

{
  "nome": "Novo Usuário",
  "email": "novo@example.com",
  "senha": "senha123"
}
```

#### Listar todos os usuários (Requer autenticação)
```http
GET /api/usuarios
Authorization: Bearer {seu_token_aqui}
```

#### Buscar usuário por ID (Requer autenticação)
```http
GET /api/usuarios/{id}
Authorization: Bearer {seu_token_aqui}
```

#### Atualizar usuário (Requer autenticação)
```http
PUT /api/usuarios/{id}
Authorization: Bearer {seu_token_aqui}
Content-Type: application/json

{
  "nome": "Nome Atualizado",
  "email": "email@example.com",
  "senha": "novaSenha123"
}
```

#### Deletar usuário (Requer autenticação)
```http
DELETE /api/usuarios/{id}
Authorization: Bearer {seu_token_aqui}
```

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação.

1. Faça login no endpoint `/api/auth/login`
2. Copie o token retornado
3. Inclua o token no header de todas as requisições protegidas:
   ```
   Authorization: Bearer {seu_token}
   ```

## 🗄️ Banco de Dados

### Configuração do MySQL (Docker)

- **Host:** localhost
- **Porta:** 3307
- **Database:** BackEndDb
- **Usuário:** backend_user
- **Senha:** backend_pass123

### Comandos úteis do Docker

```bash
# Ver logs do container
docker-compose logs -f

# Parar o container
docker-compose down

# Reiniciar o container
docker-compose restart

# Ver status dos containers
docker-compose ps
```

## 🛠️ Comandos Úteis

```bash
# Compilar o projeto
dotnet build

# Executar a aplicação
dotnet run

# Executar em modo watch (recarrega ao salvar)
dotnet watch run

# Criar uma nova migration
dotnet ef migrations add NomeDaMigration

# Aplicar migrations
dotnet ef database update

# Reverter última migration
dotnet ef migrations remove
```

## 📁 Estrutura do Projeto

```
back-end/
├── Constants/          # Mensagens e constantes
├── Data/              # DbContext e DbInitializer
├── DTOs/              # Data Transfer Objects
├── Endpoints/         # Endpoints da API
├── Models/            # Modelos de dados
├── Services/          # Serviços (JWT, etc)
├── Migrations/        # Migrations do EF Core
├── Program.cs         # Configuração da aplicação
├── appsettings.json   # Configurações
└── docker-compose.yml # Configuração do Docker
```

## ⚙️ Configurações

As configurações estão em `appsettings.Development.json`:

- **ConnectionString:** String de conexão com MySQL
- **JWT:Key:** Chave secreta para assinar tokens
- **JWT:Issuer:** Emissor do token
- **JWT:Audience:** Audiência do token

## 🐛 Solução de Problemas

### Porta 3307 já está em uso
Se a porta 3307 estiver ocupada, edite o arquivo `docker-compose.yml` e `appsettings.Development.json` para usar outra porta.

### Docker não está rodando
Certifique-se de que o Docker Desktop está aberto e rodando.

### Erro ao conectar no banco
Verifique se o container MySQL está rodando:
```bash
docker-compose ps
```

### Aplicação não compila
Certifique-se de ter o .NET 9.0 SDK instalado:
```bash
dotnet --version
```

## 📝 Notas Importantes

- O token JWT expira em **8 horas**
- As senhas são armazenadas com hash usando **BCrypt**
- O seed de usuários só é executado se o banco estiver vazio
- Os dados do MySQL são persistidos em um volume Docker

## 🔄 Atualizações Futuras

Para atualizar o projeto:

1. Pare a aplicação (Ctrl+C)
2. Baixe as atualizações
3. Execute `dotnet restore`
4. Execute `dotnet ef database update` (se houver novas migrations)
5. Inicie a aplicação com `dotnet run`

## 📞 Suporte

Em caso de dúvidas ou problemas, entre em contato com o desenvolvedor.

---

**Desenvolvido com ASP.NET Core 9.0 + MySQL + JWT**
