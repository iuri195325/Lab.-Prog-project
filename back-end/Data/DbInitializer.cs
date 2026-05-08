using Microsoft.EntityFrameworkCore;

public static class DbInitializer
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        context.Database.Migrate();

        if (context.Usuarios.Any())
        {
            return;
        }
        
        // ========================================
        // USUÁRIOS ADMINISTRADORES
        // ========================================
        var admin1 = new Usuario
        {
            Nome = "Admin Sistema",
            Email = "admin@sistema.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Tipo = TipoUsuario.Administrador
        };

        var admin2 = new Usuario
        {
            Nome = "Supervisor Geral",
            Email = "supervisor@sistema.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Tipo = TipoUsuario.Administrador
        };

        // ========================================
        // USUÁRIOS OPERADORES
        // ========================================
        var operador1 = new Usuario
        {
            Nome = "Carlos Operador",
            Email = "carlos.operador@sistema.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
            Tipo = TipoUsuario.Operador
        };

        var operador2 = new Usuario
        {
            Nome = "Ana Operadora",
            Email = "ana.operadora@sistema.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
            Tipo = TipoUsuario.Operador
        };

        var operador3 = new Usuario
        {
            Nome = "Roberto Atendente",
            Email = "roberto@sistema.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
            Tipo = TipoUsuario.Operador
        };

        // ========================================
        // USUÁRIOS CIDADÃOS
        // ========================================
        var cidadao1 = new Usuario
        {
            Nome = "João Silva",
            Email = "joao@email.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
            Tipo = TipoUsuario.Cidadao
        };

        var cidadao2 = new Usuario
        {
            Nome = "Maria Santos",
            Email = "maria@email.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
            Tipo = TipoUsuario.Cidadao
        };

        var cidadao3 = new Usuario
        {
            Nome = "Pedro Oliveira",
            Email = "pedro@email.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
            Tipo = TipoUsuario.Cidadao
        };

        var cidadao4 = new Usuario
        {
            Nome = "Fernanda Costa",
            Email = "fernanda@email.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
            Tipo = TipoUsuario.Cidadao
        };

        var cidadao5 = new Usuario
        {
            Nome = "Lucas Mendes",
            Email = "lucas@email.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
            Tipo = TipoUsuario.Cidadao
        };

        context.Usuarios.AddRange(
            admin1, admin2,
            operador1, operador2, operador3,
            cidadao1, cidadao2, cidadao3, cidadao4, cidadao5
        );
        context.SaveChanges();

        // ========================================
        // DENÚNCIAS DE EXEMPLO
        // ========================================
        var denuncias = new[]
        {
            // Denúncias do João (cidadao1)
            new Denuncia
            {
                TipoDenuncia = "violencia",
                Prioridade = "alta",
                Local = "Rua das Palmeiras, 456 - Centro",
                Descricao = "Presenciei uma briga entre dois homens na esquina. Um deles estava armado com uma faca.",
                CodigoAnonimo = "ANON_20260505_7834",
                Anonima = true,
                UsuarioId = cidadao1.Id,
                HoraCriacao = "15:45"
            },
            new Denuncia
            {
                TipoDenuncia = "furto",
                Prioridade = "media",
                Local = "Avenida Central, 789 - Jardim América",
                Descricao = "Minha bicicleta foi furtada em frente ao mercado. Era uma bike vermelha marca Caloi.",
                CodigoAnonimo = "ANON_20260505_2156",
                Anonima = false,
                UsuarioId = cidadao1.Id,
                HoraCriacao = "14:20"
            },
            
            // Denúncias da Maria (cidadao2)
            new Denuncia
            {
                TipoDenuncia = "trafico",
                Prioridade = "alta",
                Local = "Praça da Liberdade - próximo ao coreto",
                Descricao = "Todos os dias às 18h há movimentação suspeita de venda de drogas. Jovens se aproximam de um carro preto.",
                CodigoAnonimo = "ANON_20260505_9421",
                Anonima = true,
                UsuarioId = cidadao2.Id,
                HoraCriacao = "13:30"
            },
            new Denuncia
            {
                TipoDenuncia = "perturbacao",
                Prioridade = "baixa",
                Local = "Rua dos Lírios, 123 - Apt 302",
                Descricao = "Vizinho do andar de cima faz festa com som alto todos os finais de semana até 4h da manhã.",
                CodigoAnonimo = "ANON_20260505_5567",
                Anonima = false,
                UsuarioId = cidadao2.Id,
                HoraCriacao = "12:15"
            },
            
            // Denúncias do Pedro (cidadao3)
            new Denuncia
            {
                TipoDenuncia = "vandalismo",
                Prioridade = "media",
                Local = "Escola Municipal Santos Dumont",
                Descricao = "Grupo de jovens está pichando os muros da escola durante a noite. Já vi 3 vezes esta semana.",
                CodigoAnonimo = "ANON_20260505_3389",
                Anonima = true,
                UsuarioId = cidadao3.Id,
                HoraCriacao = "11:50"
            },
            new Denuncia
            {
                TipoDenuncia = "furto",
                Prioridade = "alta",
                Local = "Estacionamento do Shopping Boulevard",
                Descricao = "Vi dois homens tentando arrombar um carro prata no estacionamento descoberto. Fugiram quando viram que eu estava olhando.",
                CodigoAnonimo = "ANON_20260505_8812",
                Anonima = false,
                UsuarioId = cidadao3.Id,
                HoraCriacao = "10:30"
            },
            
            // Denúncias da Fernanda (cidadao4)
            new Denuncia
            {
                TipoDenuncia = "violencia",
                Prioridade = "alta",
                Local = "Rua das Acácias, 890 - Casa amarela",
                Descricao = "Ouço gritos de mulher pedindo socorro vindos da casa vizinha quase toda noite. Suspeito de violência doméstica.",
                CodigoAnonimo = "ANON_20260505_4456",
                Anonima = true,
                UsuarioId = cidadao4.Id,
                HoraCriacao = "22:15"
            },
            
            // Denúncias do Lucas (cidadao5)
            new Denuncia
            {
                TipoDenuncia = "outros",
                Prioridade = "baixa",
                Local = "Parque Municipal - área de churrasqueiras",
                Descricao = "Pessoas deixando lixo espalhado após churrascos. Área está ficando muito suja e com mau cheiro.",
                CodigoAnonimo = "ANON_20260505_1123",
                Anonima = false,
                UsuarioId = cidadao5.Id,
                HoraCriacao = "16:00"
            }
        };

        context.Denuncias.AddRange(denuncias);
        context.SaveChanges();

        // ========================================
        // CASOS (DENÚNCIAS PROMOVIDAS)
        // ========================================
        var caso1 = new Caso
        {
            CodigoCaso = "CASO20260505001",
            TipoCaso = "violencia",
            Prioridade = "alta",
            Status = "em_andamento",
            CodigoAnonimo = denuncias[0].CodigoAnonimo,
            Local = denuncias[0].Local,
            Descricao = denuncias[0].Descricao,
            DenunciaOrigemId = denuncias[0].Id,
            OperadorResponsavelId = operador1.Id
        };

        var caso2 = new Caso
        {
            CodigoCaso = "CASO20260505002",
            TipoCaso = "trafico",
            Prioridade = "alta",
            Status = "aberto",
            CodigoAnonimo = denuncias[2].CodigoAnonimo,
            Local = denuncias[2].Local,
            Descricao = denuncias[2].Descricao,
            DenunciaOrigemId = denuncias[2].Id,
            OperadorResponsavelId = operador2.Id
        };

        var caso3 = new Caso
        {
            CodigoCaso = "CASO20260505003",
            TipoCaso = "violencia",
            Prioridade = "alta",
            Status = "em_andamento",
            CodigoAnonimo = denuncias[6].CodigoAnonimo,
            Local = denuncias[6].Local,
            Descricao = denuncias[6].Descricao,
            DenunciaOrigemId = denuncias[6].Id,
            OperadorResponsavelId = operador1.Id
        };

        context.Casos.AddRange(caso1, caso2, caso3);
        context.SaveChanges();

        // Atualizar denúncias com os casos
        denuncias[0].CasoId = caso1.Id;
        denuncias[2].CasoId = caso2.Id;
        denuncias[6].CasoId = caso3.Id;
        context.SaveChanges();

        // ========================================
        // MENSAGENS DOS CASOS
        // ========================================
        var mensagens = new[]
        {
            // Mensagens do Caso 1
            new MensagemCaso
            {
                Texto = "Preciso de ajuda urgente, a situação está se repetindo",
                Remetente = "denunciante",
                HoraEnvio = "14:30",
                CasoId = caso1.Id,
                UsuarioId = cidadao1.Id
            },
            new MensagemCaso
            {
                Texto = "Viatura a caminho. Mantenha-se em local seguro e não se aproxime.",
                Remetente = "operador",
                HoraEnvio = "14:32",
                CasoId = caso1.Id,
                UsuarioId = operador1.Id
            },
            new MensagemCaso
            {
                Texto = "Entendido, estou aguardando em casa.",
                Remetente = "denunciante",
                HoraEnvio = "14:33",
                CasoId = caso1.Id,
                UsuarioId = cidadao1.Id
            },
            
            // Mensagens do Caso 2
            new MensagemCaso
            {
                Texto = "Consegue identificar o modelo do carro?",
                Remetente = "operador",
                HoraEnvio = "15:00",
                CasoId = caso2.Id,
                UsuarioId = operador2.Id
            },
            new MensagemCaso
            {
                Texto = "Parece ser um Gol preto, placa começa com ABC",
                Remetente = "denunciante",
                HoraEnvio = "15:05",
                CasoId = caso2.Id,
                UsuarioId = cidadao2.Id
            },
            
            // Mensagens do Caso 3
            new MensagemCaso
            {
                Texto = "Estamos monitorando a situação. Pode informar os horários mais frequentes?",
                Remetente = "operador",
                HoraEnvio = "22:30",
                CasoId = caso3.Id,
                UsuarioId = operador1.Id
            }
        };

        context.MensagensCaso.AddRange(mensagens);
        context.SaveChanges();

        // ========================================
        // VIATURAS
        // ========================================
        var viaturas = new[]
        {
            new Viatura
            {
                Placa = "ABC-1234",
                Identificacao = "VTR-001",
                Tipo = "Patrulha",
                Status = "Disponível",
                Observacoes = "Viatura padrão para patrulhamento"
            },
            new Viatura
            {
                Placa = "DEF-5678",
                Identificacao = "VTR-002",
                Tipo = "Resgate",
                Status = "Disponível",
                Observacoes = "Equipada para emergências médicas"
            },
            new Viatura
            {
                Placa = "GHI-9012",
                Identificacao = "VTR-003",
                Tipo = "Investigação",
                Status = "Disponível"
            },
            new Viatura
            {
                Placa = "JKL-3456",
                Identificacao = "VTR-004",
                Tipo = "Patrulha",
                Status = "Manutenção",
                Observacoes = "Em manutenção preventiva"
            },
            new Viatura
            {
                Placa = "MNO-7890",
                Identificacao = "VTR-005",
                Tipo = "Patrulha",
                Status = "Disponível"
            }
        };

        context.Viaturas.AddRange(viaturas);
        context.SaveChanges();

        // ========================================
        // LOG DE CRIAÇÃO
        // ========================================
        Console.WriteLine("\n" + new string('=', 60));
        Console.WriteLine("SEED DE DADOS CRIADO COM SUCESSO!");
        Console.WriteLine(new string('=', 60));
        
        Console.WriteLine("\nADMINISTRADORES:");
        Console.WriteLine("   - admin@sistema.com (senha: admin123)");
        Console.WriteLine("   - supervisor@sistema.com (senha: admin123)");
        
        Console.WriteLine("\nOPERADORES:");
        Console.WriteLine("   - carlos.operador@sistema.com (senha: senha123)");
        Console.WriteLine("   - ana.operadora@sistema.com (senha: senha123)");
        Console.WriteLine("   - roberto@sistema.com (senha: senha123)");
        
        Console.WriteLine("\nCIDADAOS:");
        Console.WriteLine("   - joao@email.com (senha: senha123)");
        Console.WriteLine("   - maria@email.com (senha: senha123)");
        Console.WriteLine("   - pedro@email.com (senha: senha123)");
        Console.WriteLine("   - fernanda@email.com (senha: senha123)");
        Console.WriteLine("   - lucas@email.com (senha: senha123)");
        
        Console.WriteLine($"\n{denuncias.Length} denuncias criadas");
        Console.WriteLine($"3 casos criados com {mensagens.Length} mensagens");
        Console.WriteLine($"{viaturas.Length} viaturas criadas");
        Console.WriteLine(new string('=', 60) + "\n");
    }
}
