using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

public static class RelatoriosEndpoints
{
    public static void MapRelatoriosEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/relatorios").RequireAuthorization();

    
        group.MapGet("/dashboard", [Authorize] async (AppDbContext db, HttpContext context, DateTime? dataInicio, DateTime? dataFim) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador")
            {
                return Results.Forbid();
            }

            var inicio = dataInicio ?? DateTime.UtcNow.AddMonths(-1);
            var fim = dataFim ?? DateTime.UtcNow;

            var denuncias = await db.Denuncias
                .Where(d => d.DataCriacao >= inicio && d.DataCriacao <= fim)
                .ToListAsync();

            var casos = await db.Casos
                .Include(c => c.Viatura)
                .Include(c => c.OperadorResponsavel)
                .Where(c => c.DataAbertura >= inicio && c.DataAbertura <= fim)
                .ToListAsync();

            var denunciasPorTipo = denuncias
                .GroupBy(d => d.TipoDenuncia)
                .ToDictionary(g => g.Key, g => g.Count());

            var denunciasPorPrioridade = denuncias
                .GroupBy(d => d.Prioridade)
                .ToDictionary(g => g.Key, g => g.Count());

            var casosPorStatus = casos
                .GroupBy(c => c.Status)
                .ToDictionary(g => g.Key, g => g.Count());

            var viaturasMaisUtilizadas = casos
                .Where(c => c.Viatura != null)
                .GroupBy(c => c.Viatura!)
                .Select(g => new
                {
                    identificacao = g.Key.Identificacao,
                    casosAtendidos = g.Count()
                })
                .OrderByDescending(x => x.casosAtendidos)
                .Take(5)
                .ToList();

            var operadoresMaisAtivos = casos
                .Where(c => c.OperadorResponsavel != null)
                .GroupBy(c => c.OperadorResponsavel!)
                .Select(g => new
                {
                    nome = g.Key.Nome,
                    casosGerenciados = g.Count()
                })
                .OrderByDescending(x => x.casosGerenciados)
                .Take(5)
                .ToList();

            // Calcular tempo médio de resposta (denúncia -> caso)
            var casosParaTempo = await db.Casos
                .Include(c => c.DenunciaOrigem)
                .Where(c => c.DataAbertura >= inicio && c.DataAbertura <= fim)
                .Select(c => new
                {
                    c.DataAbertura,
                    DataDenuncia = c.DenunciaOrigem.DataCriacao
                })
                .ToListAsync();

            var tempoMedioResposta = casosParaTempo.Any() 
                ? $"{casosParaTempo.Average(x => (x.DataAbertura - x.DataDenuncia).TotalHours):F1} horas"
                : "N/A";

            var dashboard = new
            {
                totalDenuncias = denuncias.Count,
                totalCasos = casos.Count,
                denunciasPorTipo,
                denunciasPorPrioridade,
                casosPorStatus,
                tempoMedioResposta,
                viaturasMaisUtilizadas,
                operadoresMaisAtivos,
                periodo = new
                {
                    inicio = inicio.ToString("yyyy-MM-dd"),
                    fim = fim.ToString("yyyy-MM-dd")
                }
            };

            return Results.Ok(dashboard);
        });

        // GET /api/relatorios/denuncias - Relatório detalhado de denúncias
        group.MapGet("/denuncias", [Authorize] async (AppDbContext db, HttpContext context, DateTime? dataInicio, DateTime? dataFim) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador")
            {
                return Results.Forbid();
            }

            var inicio = dataInicio ?? DateTime.UtcNow.AddMonths(-1);
            var fim = dataFim ?? DateTime.UtcNow;

            var denuncias = await db.Denuncias
                .Include(d => d.Usuario)
                .Include(d => d.Caso)
                .Where(d => d.DataCriacao >= inicio && d.DataCriacao <= fim)
                .Select(d => new
                {
                    d.Id,
                    d.TipoDenuncia,
                    d.Prioridade,
                    d.Local,
                    d.Anonima,
                    d.DataCriacao,
                    usuario = d.Usuario != null ? d.Usuario.Nome : "Anônimo",
                    promovida = d.Caso != null,
                    casoId = d.Caso != null ? d.Caso.CodigoCaso : null
                })
                .OrderByDescending(d => d.DataCriacao)
                .ToListAsync();

            return Results.Ok(new
            {
                total = denuncias.Count,
                denuncias
            });
        });

        // GET /api/relatorios/casos - Relatório detalhado de casos
        group.MapGet("/casos", [Authorize] async (AppDbContext db, HttpContext context, DateTime? dataInicio, DateTime? dataFim) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador")
            {
                return Results.Forbid();
            }

            var inicio = dataInicio ?? DateTime.UtcNow.AddMonths(-1);
            var fim = dataFim ?? DateTime.UtcNow;

            var casos = await db.Casos
                .Include(c => c.OperadorResponsavel)
                .Include(c => c.Viatura)
                .Where(c => c.DataAbertura >= inicio && c.DataAbertura <= fim)
                .Select(c => new
                {
                    c.Id,
                    c.CodigoCaso,
                    c.TipoCaso,
                    c.Prioridade,
                    c.Status,
                    c.DataAbertura,
                    c.DataFechamento,
                    operador = c.OperadorResponsavel != null ? c.OperadorResponsavel.Nome : null,
                    viatura = c.Viatura != null ? c.Viatura.Identificacao : null,
                    tempoAberto = c.DataFechamento != null 
                        ? (c.DataFechamento.Value - c.DataAbertura).TotalHours
                        : (DateTime.UtcNow - c.DataAbertura).TotalHours
                })
                .OrderByDescending(c => c.DataAbertura)
                .ToListAsync();

            return Results.Ok(new
            {
                total = casos.Count,
                casos
            });
        });

        // GET /api/relatorios/viaturas - Relatório de viaturas
        group.MapGet("/viaturas", [Authorize] async (AppDbContext db, HttpContext context) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador")
            {
                return Results.Forbid();
            }

            var viaturas = await db.Viaturas
                .Include(v => v.Casos)
                .Select(v => new
                {
                    v.Id,
                    v.Placa,
                    v.Identificacao,
                    v.Tipo,
                    v.Status,
                    totalCasosAtendidos = v.Casos.Count,
                    casosAtivos = v.Casos.Count(c => c.Status != "fechado"),
                    casosFechados = v.Casos.Count(c => c.Status == "fechado")
                })
                .ToListAsync();

            return Results.Ok(new
            {
                total = viaturas.Count,
                disponiveis = viaturas.Count(v => v.Status == "Disponível"),
                emAtendimento = viaturas.Count(v => v.Status == "Em Atendimento"),
                viaturas
            });
        });

        // GET /api/relatorios/operadores - Relatório de operadores
        group.MapGet("/operadores", [Authorize] async (AppDbContext db, HttpContext context, DateTime? dataInicio, DateTime? dataFim) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador")
            {
                return Results.Forbid();
            }

            var inicio = dataInicio ?? DateTime.UtcNow.AddMonths(-1);
            var fim = dataFim ?? DateTime.UtcNow;

            var operadores = await db.Usuarios
                .Where(u => u.Tipo == TipoUsuario.Operador || u.Tipo == TipoUsuario.Administrador)
                .Select(u => new
                {
                    u.Id,
                    u.Nome,
                    u.Email,
                    u.Tipo,
                    casosGerenciados = u.CasosGerenciados.Count(c => c.DataAbertura >= inicio && c.DataAbertura <= fim),
                    casosAtivos = u.CasosGerenciados.Count(c => c.Status != "fechado"),
                    casosFechados = u.CasosGerenciados.Count(c => c.Status == "fechado" && c.DataAbertura >= inicio && c.DataAbertura <= fim),
                    mensagensEnviadas = u.Mensagens.Count(m => m.DataEnvio >= inicio && m.DataEnvio <= fim)
                })
                .OrderByDescending(u => u.casosGerenciados)
                .ToListAsync();

            return Results.Ok(new
            {
                total = operadores.Count,
                operadores
            });
        });
    }
}
