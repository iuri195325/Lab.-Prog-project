using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using DTOs;

public static class ViaturasEndpoints
{
    public static void MapViaturasEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/viaturas").RequireAuthorization();

        // GET /api/viaturas - Listar todas as viaturas
        group.MapGet("/", [Authorize] async (AppDbContext db, HttpContext context) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador" && userType != "Operador")
            {
                return Results.Forbid();
            }

            var viaturas = await db.Viaturas
                .Include(v => v.Casos.Where(c => c.Status != "fechado"))
                .Select(v => new ViaturaResponse
                {
                    Id = v.Id,
                    Placa = v.Placa,
                    Identificacao = v.Identificacao,
                    Tipo = v.Tipo,
                    Status = v.Status,
                    Observacoes = v.Observacoes,
                    DataCadastro = v.DataCadastro,
                    CasosAtivos = v.Casos.Count(c => c.Status != "fechado")
                })
                .ToListAsync();

            return Results.Ok(viaturas);
        });

        // GET /api/viaturas/{id} - Buscar viatura por ID
        group.MapGet("/{id}", [Authorize] async (int id, AppDbContext db, HttpContext context) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador" && userType != "Operador")
            {
                return Results.Forbid();
            }

            var viatura = await db.Viaturas
                .Include(v => v.Casos.Where(c => c.Status != "fechado"))
                .Where(v => v.Id == id)
                .Select(v => new ViaturaResponse
                {
                    Id = v.Id,
                    Placa = v.Placa,
                    Identificacao = v.Identificacao,
                    Tipo = v.Tipo,
                    Status = v.Status,
                    Observacoes = v.Observacoes,
                    DataCadastro = v.DataCadastro,
                    CasosAtivos = v.Casos.Count(c => c.Status != "fechado")
                })
                .FirstOrDefaultAsync();

            return viatura is not null ? Results.Ok(viatura) : Results.NotFound();
        });

        // GET /api/viaturas/disponiveis - Listar viaturas disponíveis
        group.MapGet("/disponiveis", [Authorize] async (AppDbContext db, HttpContext context) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador" && userType != "Operador")
            {
                return Results.Forbid();
            }

            var viaturas = await db.Viaturas
                .Where(v => v.Status == "Disponível")
                .Select(v => new ViaturaSimples
                {
                    Id = v.Id,
                    Placa = v.Placa,
                    Identificacao = v.Identificacao,
                    Status = v.Status
                })
                .ToListAsync();

            return Results.Ok(viaturas);
        });

        // POST /api/viaturas - Criar viatura
        group.MapPost("/", [Authorize] async (ViaturaRequest request, AppDbContext db, HttpContext context) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador")
            {
                return Results.Forbid();
            }

            // Validar placa única
            if (await db.Viaturas.AnyAsync(v => v.Placa == request.Placa))
            {
                return Results.BadRequest(new { message = "Placa já cadastrada" });
            }

            // Validar identificação única
            if (await db.Viaturas.AnyAsync(v => v.Identificacao == request.Identificacao))
            {
                return Results.BadRequest(new { message = "Identificação já cadastrada" });
            }

            var viatura = new Viatura
            {
                Placa = request.Placa,
                Identificacao = request.Identificacao,
                Tipo = request.Tipo,
                Status = request.Status,
                Observacoes = request.Observacoes,
                DataCadastro = DateTime.UtcNow
            };

            db.Viaturas.Add(viatura);
            await db.SaveChangesAsync();

            var response = new ViaturaResponse
            {
                Id = viatura.Id,
                Placa = viatura.Placa,
                Identificacao = viatura.Identificacao,
                Tipo = viatura.Tipo,
                Status = viatura.Status,
                Observacoes = viatura.Observacoes,
                DataCadastro = viatura.DataCadastro,
                CasosAtivos = 0
            };

            return Results.Created($"/api/viaturas/{viatura.Id}", response);
        });

        // PUT /api/viaturas/{id} - Atualizar viatura
        group.MapPut("/{id}", [Authorize] async (int id, ViaturaRequest request, AppDbContext db, HttpContext context) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador")
            {
                return Results.Forbid();
            }

            var viatura = await db.Viaturas.FindAsync(id);
            if (viatura is null)
            {
                return Results.NotFound();
            }

            // Validar placa única (exceto a própria viatura)
            if (await db.Viaturas.AnyAsync(v => v.Placa == request.Placa && v.Id != id))
            {
                return Results.BadRequest(new { message = "Placa já cadastrada" });
            }

            // Validar identificação única (exceto a própria viatura)
            if (await db.Viaturas.AnyAsync(v => v.Identificacao == request.Identificacao && v.Id != id))
            {
                return Results.BadRequest(new { message = "Identificação já cadastrada" });
            }

            viatura.Placa = request.Placa;
            viatura.Identificacao = request.Identificacao;
            viatura.Tipo = request.Tipo;
            viatura.Status = request.Status;
            viatura.Observacoes = request.Observacoes;

            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        // PUT /api/viaturas/{id}/status - Atualizar apenas status
        group.MapPut("/{id}/status", [Authorize] async (int id, StatusUpdateRequest request, AppDbContext db, HttpContext context) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador" && userType != "Operador")
            {
                return Results.Forbid();
            }

            var viatura = await db.Viaturas.FindAsync(id);
            if (viatura is null)
            {
                return Results.NotFound();
            }

            viatura.Status = request.Status;
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        // DELETE /api/viaturas/{id} - Excluir viatura
        group.MapDelete("/{id}", [Authorize] async (int id, AppDbContext db, HttpContext context) =>
        {
            var userType = context.User.FindFirst("TipoUsuario")?.Value 
                ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userType != "Administrador")
            {
                return Results.Forbid();
            }

            var viatura = await db.Viaturas
                .Include(v => v.Casos)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (viatura is null)
            {
                return Results.NotFound();
            }

            // Não permitir excluir se houver casos ativos
            if (viatura.Casos.Any(c => c.Status != "fechado"))
            {
                return Results.BadRequest(new { message = "Não é possível excluir viatura com casos ativos" });
            }

            db.Viaturas.Remove(viatura);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}

public class StatusUpdateRequest
{
    public string Status { get; set; } = string.Empty;
}
