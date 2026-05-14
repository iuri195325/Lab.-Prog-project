using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using DTOs;

public static class CasosEndpoints
{
    public static void MapCasosEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/casos")
            .WithTags("Casos")
            .RequireAuthorization();

        // GET /api/casos - Listar todos
        group.MapGet("/", async (AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);

            if (usuario == null) return Results.Unauthorized();

            // Cidadão só vê casos das suas denúncias
            if (usuario.Tipo == TipoUsuario.Cidadao)
            {
                var meusCasos = await db.Casos
                    .Include(c => c.DenunciaOrigem)
                    .Include(c => c.Mensagens)
                        .ThenInclude(m => m.Usuario)
                    .Include(c => c.Viatura)
                    .Where(c => c.DenunciaOrigem.UsuarioId == userId)
                    .OrderByDescending(c => c.DataAbertura)
                    .ToListAsync();

                return Results.Ok(new
                {
                    Message = "Seus casos",
                    Data = meusCasos.Select(c => MapToResponse(c))
                });
            }

            // Operador/Admin vê todos
            var casos = await db.Casos
                .Include(c => c.OperadorResponsavel)
                .Include(c => c.Mensagens)
                    .ThenInclude(m => m.Usuario)
                .Include(c => c.Viatura)
                .OrderByDescending(c => c.DataAbertura)
                .ToListAsync();

            return Results.Ok(new
            {
                Message = "Lista de casos",
                Data = casos.Select(c => MapToResponse(c))
            });
        });

        // GET /api/casos/{id}
        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var caso = await db.Casos
                .Include(c => c.OperadorResponsavel)
                .Include(c => c.Mensagens)
                .ThenInclude(m => m.Usuario)
                .Include(c => c.Viatura)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (caso == null)
                return Results.NotFound(new { Message = "Caso não encontrado" });

            return Results.Ok(new
            {
                Message = "Caso encontrado",
                Data = MapToResponse(caso)
            });
        });

        // PUT /api/casos/{id} - Atualizar status
        group.MapPut("/{id}", async (int id, AtualizarCasoRequest request, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);

            // Apenas operador/admin pode atualizar
            if (usuario == null || usuario.Tipo == TipoUsuario.Cidadao)
                return Results.Forbid();

            var caso = await db.Casos.FindAsync(id);
            if (caso == null)
                return Results.NotFound(new { Message = "Caso não encontrado" });

            if (!string.IsNullOrEmpty(request.Status))
            {
                caso.Status = request.Status;
                
                if (request.Status == "fechado" || request.Status == "resolvido")
                {
                    caso.DataFechamento = DateTime.UtcNow;
                }
            }

            if (request.OperadorResponsavelId.HasValue)
            {
                caso.OperadorResponsavelId = request.OperadorResponsavelId;
            }

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                Message = "Caso atualizado com sucesso",
                Data = new
                {
                    caso.Id,
                    caso.CodigoCaso,
                    caso.Status,
                    caso.DataFechamento
                }
            });
        });

        // DELETE /api/casos/{id}
        group.MapDelete("/{id}", async (int id, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);

            // Apenas admin pode deletar casos
            if (usuario == null || usuario.Tipo != TipoUsuario.Administrador)
                return Results.Forbid();

            var caso = await db.Casos.FindAsync(id);
            if (caso == null)
                return Results.NotFound(new { Message = "Caso não encontrado" });

            db.Casos.Remove(caso);
            await db.SaveChangesAsync();

            return Results.Ok(new { Message = "Caso excluído com sucesso" });
        });

        // GET /api/casos/{id}/mensagens
        group.MapGet("/{id}/mensagens", async (int id, AppDbContext db) =>
        {
            var caso = await db.Casos
                .Include(c => c.Mensagens)
                .ThenInclude(m => m.Usuario)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (caso == null)
                return Results.NotFound(new { Message = "Caso não encontrado" });

            var mensagens = caso.Mensagens
                .OrderBy(m => m.DataEnvio)
                .Select(m => new MensagemResponse
                {
                    Id = m.Id,
                    Texto = m.Texto,
                    DataEnvio = m.DataEnvio,
                    HoraEnvio = m.HoraEnvio,
                    Remetente = m.Remetente,
                    UsuarioId = m.UsuarioId,
                    UsuarioNome = m.Usuario?.Nome
                })
                .ToList();

            return Results.Ok(new
            {
                Message = "Mensagens do caso",
                Data = mensagens
            });
        });

        // POST /api/casos/{id}/mensagens - Enviar mensagem
        group.MapPost("/{id}/mensagens", async (int id, EnviarMensagemRequest request, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);

            var caso = await db.Casos
                .Include(c => c.DenunciaOrigem)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (caso == null)
                return Results.NotFound(new { Message = "Caso não encontrado" });

            // Determinar remetente
            string remetente;
            if (usuario?.Tipo == TipoUsuario.Cidadao)
            {
                // Verificar se é o dono da denúncia
                if (caso.DenunciaOrigem.UsuarioId != userId)
                    return Results.Forbid();
                remetente = "denunciante";
            }
            else
            {
                remetente = "operador";
            }

            var mensagem = new MensagemCaso
            {
                Texto = request.Texto,
                DataEnvio = DateTime.UtcNow,
                HoraEnvio = DateTime.Now.ToString("HH:mm"),
                Remetente = remetente,
                CasoId = id,
                UsuarioId = userId
            };

            db.MensagensCaso.Add(mensagem);
            await db.SaveChangesAsync();

            return Results.Created($"/api/casos/{id}/mensagens/{mensagem.Id}", new
            {
                Message = "Mensagem enviada com sucesso",
                Data = new MensagemResponse
                {
                    Id = mensagem.Id,
                    Texto = mensagem.Texto,
                    DataEnvio = mensagem.DataEnvio,
                    HoraEnvio = mensagem.HoraEnvio,
                    Remetente = mensagem.Remetente,
                    UsuarioId = mensagem.UsuarioId,
                    UsuarioNome = usuario?.Nome
                }
            });
        });

        // POST /api/casos/{id}/vincular-viatura - Vincular viatura ao caso
        group.MapPost("/{id}/vincular-viatura", async (int id, VincularViaturaRequest request, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);

            if (usuario == null || (usuario.Tipo != TipoUsuario.Administrador && usuario.Tipo != TipoUsuario.Operador))
            {
                return Results.Forbid();
            }

            var caso = await db.Casos.Include(c => c.Viatura).FirstOrDefaultAsync(c => c.Id == id);
            if (caso == null) return Results.NotFound(new { message = "Caso não encontrado" });

            var viatura = await db.Viaturas.FindAsync(request.ViaturaId);
            if (viatura == null) return Results.NotFound(new { message = "Viatura não encontrada" });

            if (viatura.Status != "Disponível")
            {
                return Results.BadRequest(new { message = "Viatura não está disponível" });
            }

            caso.ViaturaId = request.ViaturaId;
            caso.DataVinculacaoViatura = DateTime.UtcNow;
            caso.UsuarioVinculacaoViaturaId = userId;
            caso.Status = "em_andamento";

            viatura.Status = "Em Atendimento";

            await db.SaveChangesAsync();

            return Results.Ok(new { message = "Viatura vinculada com sucesso" });
        });

        // POST /api/casos/{id}/finalizar - Finalizar caso e liberar viatura
        group.MapPost("/{id}/finalizar", async (int id, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);

            if (usuario == null || (usuario.Tipo != TipoUsuario.Administrador && usuario.Tipo != TipoUsuario.Operador))
            {
                return Results.Forbid();
            }

            var caso = await db.Casos.Include(c => c.Viatura).FirstOrDefaultAsync(c => c.Id == id);
            if (caso == null) return Results.NotFound(new { message = "Caso não encontrado" });

            // Liberar viatura se houver uma vinculada
            if (caso.Viatura != null)
            {
                caso.Viatura.Status = "Disponível";
            }

            // Atualizar status do caso
            caso.Status = "finalizado";
            caso.DataFechamento = DateTime.UtcNow;
            caso.ViaturaId = null;
            caso.DataVinculacaoViatura = null;
            caso.UsuarioVinculacaoViaturaId = null;

            await db.SaveChangesAsync();

            return Results.Ok(new { message = "Caso finalizado com sucesso" });
        });

        // DELETE /api/casos/{id}/desvincular-viatura - Desvincular viatura do caso
        group.MapDelete("/{id}/desvincular-viatura", async (int id, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);

            if (usuario == null || (usuario.Tipo != TipoUsuario.Administrador && usuario.Tipo != TipoUsuario.Operador))
            {
                return Results.Forbid();
            }

            var caso = await db.Casos.Include(c => c.Viatura).FirstOrDefaultAsync(c => c.Id == id);
            if (caso == null) return Results.NotFound(new { message = "Caso não encontrado" });

            if (caso.Viatura != null)
            {
                caso.Viatura.Status = "Disponível";
            }

            caso.ViaturaId = null;
            caso.DataVinculacaoViatura = null;
            caso.UsuarioVinculacaoViaturaId = null;

            await db.SaveChangesAsync();

            return Results.Ok(new { message = "Viatura desvinculada com sucesso" });
        });
    }

    private static CasoResponse MapToResponse(Caso c)
    {
        return new CasoResponse
        {
            Id = c.Id,
            CodigoCaso = c.CodigoCaso,
            TipoCaso = c.TipoCaso,
            Prioridade = c.Prioridade,
            Status = c.Status,
            CodigoAnonimo = c.CodigoAnonimo,
            DataAbertura = c.DataAbertura,
            DataFechamento = c.DataFechamento,
            Local = c.Local,
            Descricao = c.Descricao,
            DenunciaOrigemId = c.DenunciaOrigemId,
            OperadorResponsavelId = c.OperadorResponsavelId,
            OperadorNome = c.OperadorResponsavel?.Nome,
            Viatura = c.Viatura != null ? new ViaturaSimplesCaso
            {
                Id = c.Viatura.Id,
                Placa = c.Viatura.Placa,
                Identificacao = c.Viatura.Identificacao,
                Status = c.Viatura.Status
            } : null,
            Mensagens = c.Mensagens?.Select(m => new MensagemResponse
            {
                Id = m.Id,
                Texto = m.Texto,
                DataEnvio = m.DataEnvio,
                HoraEnvio = m.HoraEnvio,
                Remetente = m.Remetente,
                UsuarioId = m.UsuarioId,
                UsuarioNome = m.Usuario?.Nome
            }).ToList() ?? new List<MensagemResponse>()
        };
    }
}
