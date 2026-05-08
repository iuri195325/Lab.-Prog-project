# Guia de Implementação - Novas Features

## Status da Implementação

### ✅ Concluído
- [x] Documentação de especificação criada
- [x] Entidade Viatura criada (`Models/Viatura.cs`)
- [x] DTOs de Viatura criados (`DTOs/ViaturaDto.cs`)
- [x] AppDbContext atualizado com DbSet<Viatura>
- [x] Relacionamentos configurados no AppDbContext
- [x] Entidade Caso atualizada com campos de viatura
- [x] ViaturasEndpoints.cs criado com CRUD completo

### 🔄 Próximos Passos

#### 1. Criar Migration
```bash
cd back-end
dotnet ef migrations add AdicionarViaturas
dotnet ef database update
```

#### 2. Atualizar CasoDto.cs
Adicionar campos de viatura no CasoResponse:
```csharp
public ViaturaSimples? Viatura { get; set; }
public DateTime? DataVinculacaoViatura { get; set; }
```

#### 3. Atualizar CasosEndpoints.cs
Adicionar endpoints de vinculação:
- POST /api/casos/{id}/vincular-viatura
- DELETE /api/casos/{id}/desvincular-viatura

#### 4. Criar RelatoriosEndpoints.cs
Endpoints para estatísticas e relatórios.

#### 5. Atualizar UsuariosEndpoints.cs
Adicionar endpoint POST /api/usuarios/admin para cadastro de administradores.

#### 6. Atualizar AuthEndpoints.cs
Garantir que registro cria apenas cidadãos.

#### 7. Registrar Endpoints no Program.cs
```csharp
app.MapViaturasEndpoints();
app.MapRelatoriosEndpoints();
```

#### 8. Atualizar DbInitializer.cs
Adicionar seed de viaturas de exemplo.

### Front-end

#### 9. Criar Services
- `services/viaturaService.js`
- `services/adminService.js`
- `services/relatorioService.js`

#### 10. Atualizar constants.js
Adicionar:
```javascript
export const TIPOS_VIATURA = [
  { value: 'Patrulha', label: 'Patrulha' },
  { value: 'Resgate', label: 'Resgate' },
  { value: 'Investigação', label: 'Investigação' }
];

export const STATUS_VIATURA = [
  { value: 'Disponível', label: 'Disponível', color: '#44ff44' },
  { value: 'Em Atendimento', label: 'Em Atendimento', color: '#ffaa00' },
  { value: 'Manutenção', label: 'Manutenção', color: '#ff4444' },
  { value: 'Indisponível', label: 'Indisponível', color: '#888' }
];
```

#### 11. Criar ConfigPanel
- `assets/Componentes/ConfigPanel/ConfigPanel.jsx`
- `assets/Componentes/ConfigPanel/ConfigPanel.css`
- `assets/Componentes/ConfigPanel/AdminManager.jsx`
- `assets/Componentes/ConfigPanel/ViaturaManager.jsx`
- `assets/Componentes/ConfigPanel/ReportsPanel.jsx`

#### 12. Atualizar MainSystem.jsx
Adicionar botão "Configurações" na topbar (apenas para admins).

#### 13. Atualizar CasosPanel
Adicionar modal de vinculação de viatura.

#### 14. Atualizar Register.jsx
Remover seleção de tipo de usuário.

---

## Comandos Úteis

### Back-end
```bash
# Criar migration
dotnet ef migrations add AdicionarViaturas

# Aplicar migration
dotnet ef database update

# Remover última migration (se necessário)
dotnet ef migrations remove

# Rodar servidor
dotnet run
```

### Front-end
```bash
# Instalar dependências
npm install

# Rodar dev server
npm run dev
```

---

## Estrutura de Arquivos Criados

### Back-end
```
back-end/
├── Models/
│   └── Viatura.cs ✅
├── DTOs/
│   └── ViaturaDto.cs ✅
├── Endpoints/
│   ├── ViaturasEndpoints.cs ✅
│   ├── RelatoriosEndpoints.cs ⏳
│   ├── CasosEndpoints.cs (atualizar) ⏳
│   ├── UsuariosEndpoints.cs (atualizar) ⏳
│   └── AuthEndpoints.cs (atualizar) ⏳
└── Data/
    ├── AppDbContext.cs ✅
    └── DbInitializer.cs (atualizar) ⏳
```

### Front-end
```
site/site/src/
├── services/
│   ├── viaturaService.js ⏳
│   ├── adminService.js ⏳
│   └── relatorioService.js ⏳
├── assets/Componentes/
│   └── ConfigPanel/ ⏳
│       ├── ConfigPanel.jsx
│       ├── ConfigPanel.css
│       ├── AdminManager.jsx
│       ├── ViaturaManager.jsx
│       └── ReportsPanel.jsx
└── utils/
    └── constants.js (atualizar) ⏳
```

---

## Próxima Sessão de Trabalho

1. Criar e aplicar migration
2. Implementar RelatoriosEndpoints.cs
3. Atualizar CasosEndpoints.cs com vinculação
4. Atualizar UsuariosEndpoints.cs
5. Criar services no front-end
6. Implementar ConfigPanel completo
7. Testar todas as funcionalidades

---

**Legenda:**
- ✅ Concluído
- ⏳ Pendente
- 🔄 Em progresso
