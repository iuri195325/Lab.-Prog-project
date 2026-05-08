using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

public static class DenunciasEndpoints
{
    public static void MapDenunciasEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/denuncias")
            .WithTags("Denúncias")
            .RequireAuthorization();

        // GET /api/denuncias - Listar todas (admin/operador)
        group.MapGet("/", async (AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);
            
            if (usuario == null) return Results.Unauthorized();

            // Cidadão só vê suas próprias denúncias
            if (usuario.Tipo == TipoUsuario.Cidadao)
            {
                var minhasDenuncias = await db.Denuncias
                    .Where(d => d.UsuarioId == userId)
                    .Include(d => d.Anexos)
                    .OrderByDescending(d => d.DataCriacao)
                    .ToListAsync();

                return Results.Ok(new
                {
                    Message = "Suas denúncias",
                    Data = minhasDenuncias.Select(MapToResponse)
                });
            }

            // Operador/Admin vê todas
            var denuncias = await db.Denuncias
                .Include(d => d.Anexos)
                .OrderByDescending(d => d.DataCriacao)
                .ToListAsync();

            return Results.Ok(new
            {
                Message = "Lista de denúncias",
                Data = denuncias.Select(MapToResponse)
            });
        });

        // GET /api/denuncias/minhas - Minhas denúncias
        group.MapGet("/minhas", async (AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);

            var denuncias = await db.Denuncias
                .Where(d => d.UsuarioId == userId)
                .Include(d => d.Anexos)
                .Include(d => d.Caso)
                .OrderByDescending(d => d.DataCriacao)
                .ToListAsync();

            return Results.Ok(new
            {
                Message = "Suas denúncias",
                Data = denuncias.Select(d => new
                {
                    d.Id,
                    d.TipoDenuncia,
                    d.Prioridade,
                    d.Local,
                    d.Descricao,
                    d.DataCriacao,
                    d.HoraCriacao,
                    d.Anonima,
                    d.CodigoAnonimo,
                    d.CasoId,
                    CasoStatus = d.Caso?.Status,
                    CasoCodigo = d.Caso?.CodigoCaso,
                    Anexos = d.Anexos.Select(a => a.TipoAnexo).ToList()
                })
            });
        });

        // GET /api/denuncias/pendentes - Denúncias sem caso (para inbox)
        group.MapGet("/pendentes", async (AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);
            
            if (usuario == null || usuario.Tipo == TipoUsuario.Cidadao)
                return Results.Forbid();

            var denuncias = await db.Denuncias
                .Where(d => d.CasoId == null)
                .Include(d => d.Anexos)
                .OrderByDescending(d => d.DataCriacao)
                .ToListAsync();

            return Results.Ok(new
            {
                Message = "Denúncias pendentes",
                Data = denuncias.Select(MapToResponse)
            });
        });

        // GET /api/denuncias/{id}
        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var denuncia = await db.Denuncias
                .Include(d => d.Anexos)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (denuncia == null)
                return Results.NotFound(new { Message = "Denúncia não encontrada" });

            return Results.Ok(new
            {
                Message = "Denúncia encontrada",
                Data = MapToResponse(denuncia)
            });
        });

        // POST /api/denuncias - Criar denúncia
        group.MapPost("/", async (CadastrarDenunciaRequest request, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int? userId = string.IsNullOrEmpty(userIdClaim) ? null : int.Parse(userIdClaim);

            var codigoAnonimo = $"ANON_{DateTime.Now:yyyyMMddHHmmss}_{new Random().Next(1000, 9999)}";

            var denuncia = new Denuncia
            {
                TipoDenuncia = request.TipoDenuncia,
                Prioridade = request.Prioridade,
                Local = request.Local,
                Descricao = request.Descricao,
                Anonima = request.Anonima,
                CodigoAnonimo = codigoAnonimo,
                UsuarioId = userId, // Sempre salva o usuário para rastreamento interno
                DataCriacao = DateTime.UtcNow,
                HoraCriacao = DateTime.Now.ToString("HH:mm")
            };

            db.Denuncias.Add(denuncia);
            await db.SaveChangesAsync();

            return Results.Created($"/api/denuncias/{denuncia.Id}", new
            {
                Message = "Denúncia cadastrada com sucesso",
                Data = new
                {
                    denuncia.Id,
                    denuncia.CodigoAnonimo,
                    denuncia.TipoDenuncia,
                    denuncia.Prioridade,
                    denuncia.Local,
                    denuncia.DataCriacao
                }
            });
        });

        // PUT /api/denuncias/{id}
        group.MapPut("/{id}", async (int id, AtualizarDenunciaRequest request, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);

            var denuncia = await db.Denuncias.FindAsync(id);
            if (denuncia == null)
                return Results.NotFound(new { Message = "Denúncia não encontrada" });

            // Cidadão só pode editar suas próprias denúncias
            if (usuario?.Tipo == TipoUsuario.Cidadao && denuncia.UsuarioId != userId)
                return Results.Forbid();

            denuncia.TipoDenuncia = request.TipoDenuncia;
            denuncia.Prioridade = request.Prioridade;
            denuncia.Local = request.Local;
            denuncia.Descricao = request.Descricao;

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                Message = "Denúncia atualizada com sucesso",
                Data = MapToResponse(denuncia)
            });
        });

        // DELETE /api/denuncias/{id}
        group.MapDelete("/{id}", async (int id, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);

            var denuncia = await db.Denuncias.FindAsync(id);
            if (denuncia == null)
                return Results.NotFound(new { Message = "Denúncia não encontrada" });

            // Cidadão só pode deletar suas próprias denúncias
            if (usuario?.Tipo == TipoUsuario.Cidadao && denuncia.UsuarioId != userId)
                return Results.Forbid();

            db.Denuncias.Remove(denuncia);
            await db.SaveChangesAsync();

            return Results.Ok(new { Message = "Denúncia excluída com sucesso" });
        });

        // POST /api/denuncias/{id}/promover - Promover para caso
        group.MapPost("/{id}/promover", async (int id, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuario = await db.Usuarios.FindAsync(userId);

            // Apenas operador/admin pode promover
            if (usuario == null || usuario.Tipo == TipoUsuario.Cidadao)
                return Results.Forbid();

            var denuncia = await db.Denuncias.FindAsync(id);
            if (denuncia == null)
                return Results.NotFound(new { Message = "Denúncia não encontrada" });

            if (denuncia.CasoId != null)
                return Results.BadRequest(new { Message = "Denúncia já foi promovida para caso" });

            var codigoCaso = $"CASO{DateTime.Now:yyyyMMddHHmmss}";

            var caso = new Caso
            {
                CodigoCaso = codigoCaso,
                TipoCaso = denuncia.TipoDenuncia,
                Prioridade = denuncia.Prioridade,
                Status = "aberto",
                CodigoAnonimo = denuncia.CodigoAnonimo,
                DataAbertura = DateTime.UtcNow,
                Local = denuncia.Local,
                Descricao = denuncia.Descricao,
                DenunciaOrigemId = denuncia.Id,
                OperadorResponsavelId = userId
            };

            db.Casos.Add(caso);
            await db.SaveChangesAsync();

            denuncia.CasoId = caso.Id;
            await db.SaveChangesAsync();

            return Results.Created($"/api/casos/{caso.Id}", new
            {
                Message = "Denúncia promovida para caso com sucesso",
                Data = new
                {
                    caso.Id,
                    caso.CodigoCaso,
                    caso.TipoCaso,
                    caso.Prioridade,
                    caso.Status,
                    caso.CodigoAnonimo,
                    caso.DataAbertura
                }
            });
        });
    }

    private static DenunciaResponse MapToResponse(Denuncia d)
    {
        return new DenunciaResponse
        {
            Id = d.Id,
            TipoDenuncia = d.TipoDenuncia,
            Prioridade = d.Prioridade,
            Local = d.Local,
            Descricao = d.Descricao,
            DataCriacao = d.DataCriacao,
            HoraCriacao = d.HoraCriacao,
            Anonima = d.Anonima,
            CodigoAnonimo = d.CodigoAnonimo,
            UsuarioId = d.UsuarioId,
            CasoId = d.CasoId,
            Anexos = d.Anexos?.Select(a => a.TipoAnexo).ToList() ?? new List<string>()
        };
    }
}
