# 🗄️ Diagrama do Banco de Dados

## Modelo Entidade-Relacionamento

```mermaid
erDiagram
    USUARIO {
        int Id PK
        string Nome
        string Email UK
        string Senha
        TipoUsuario Tipo
        datetime DataCriacao
    }
    
    DENUNCIA {
        int Id PK
        string TipoDenuncia
        string Local
        string Descricao
        string Prioridade
        bool Anonima
        string CodigoAnonimo
        datetime DataCriacao
        int UsuarioId FK
    }
    
    CASO {
        int Id PK
        string CodigoCaso UK
        string Status
        datetime DataAbertura
        datetime DataFechamento
        int DenunciaOrigemId FK
        int OperadorResponsavelId FK
        int ViaturaId FK
    }
    
    MENSAGEM_CASO {
        int Id PK
        string Texto
        string Remetente
        datetime DataEnvio
        int CasoId FK
        int UsuarioId FK
    }
    
    ANEXO_DENUNCIA {
        int Id PK
        string NomeArquivo
        string Caminho
        string TipoArquivo
        long Tamanho
        datetime DataUpload
        int DenunciaId FK
    }
    
    VIATURA {
        int Id PK
        string Placa UK
        string Identificacao UK
        string Tipo
        string Status
        string Observacoes
    }

    %% Relacionamentos
    USUARIO ||--o{ DENUNCIA : "cria"
    USUARIO ||--o{ CASO : "gerencia"
    USUARIO ||--o{ MENSAGEM_CASO : "envia"
    
    DENUNCIA ||--o| CASO : "origina"
    DENUNCIA ||--o{ ANEXO_DENUNCIA : "possui"
    
    CASO ||--o{ MENSAGEM_CASO : "contém"
    
    VIATURA ||--o{ CASO : "atende"
```

---

## 📋 Descrição das Entidades

| Entidade | Descrição |
|----------|-----------|
| **Usuario** | Cidadãos, operadores e administradores do sistema |
| **Denuncia** | Denúncias criadas pelos cidadãos |
| **Caso** | Casos abertos a partir de denúncias promovidas |
| **MensagemCaso** | Mensagens do chat entre operador e denunciante |
| **AnexoDenuncia** | Arquivos anexados às denúncias |
| **Viatura** | Viaturas disponíveis para atendimento |

---

## 🔗 Relacionamentos

| Relação | Cardinalidade | Descrição |
|---------|---------------|-----------|
| Usuario → Denuncia | 1:N | Um usuário pode criar várias denúncias |
| Usuario → Caso | 1:N | Um operador gerencia vários casos |
| Denuncia → Caso | 1:1 | Uma denúncia pode originar um caso |
| Denuncia → Anexo | 1:N | Uma denúncia pode ter vários anexos |
| Caso → Mensagem | 1:N | Um caso pode ter várias mensagens |
| Viatura → Caso | 1:N | Uma viatura pode atender vários casos |

---

## 📊 Tipos Enumerados

### TipoUsuario
- `Cidadao` (0)
- `Operador` (1)
- `Administrador` (2)

### Status do Caso
- `aberto`
- `em_andamento`
- `resolvido`
- `fechado`

### Status da Viatura
- `Disponível`
- `Em Atendimento`
- `Manutenção`
- `Inativa`
