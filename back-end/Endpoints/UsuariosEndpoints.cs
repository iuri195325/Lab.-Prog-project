using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

public static class UsuariosEndpoints
{
    public static void MapUsuariosEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/usuarios")
            .WithTags("Usuários")
            .RequireAuthorization();

        group.MapGet("/", async (AppDbContext db) =>
        {
            var usuarios = await db.Usuarios
                .Select(u => new
                {
                    u.Id,
                    u.Nome,
                    u.Email,
                    u.Tipo,
                    TipoNome = u.Tipo.ToString(),
                    u.DataCriacao
                })
                .ToListAsync();
            return Results.Ok(new
            {
                Message = Messages.Usuario.ListagemSucesso,
                Data = usuarios
            });
        });

        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var usuario = await db.Usuarios.FindAsync(id);
            
            if (usuario is null)
            {
                return Results.NotFound(new { Message = Messages.Usuario.NaoEncontrado });
            }

            return Results.Ok(new
            {
                Message = "Usuário encontrado",
                Data = new
                {
                    usuario.Id,
                    usuario.Nome,
                    usuario.Email,
                    usuario.Tipo,
                    TipoNome = usuario.Tipo.ToString(),
                    usuario.DataCriacao
                }
            });
        });

        group.MapPost("/", async (CadastroUsuarioRequest request, AppDbContext db) =>
        {
            var usuarioExistente = await db.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuarioExistente is not null)
            {
                return Results.BadRequest(new { Message = Messages.Usuario.EmailJaCadastrado });
            }

            var usuario = new Usuario
            {
                Nome = request.Nome,
                Email = request.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.Senha),
                Tipo = TipoUsuario.Cidadao,
                DataCriacao = DateTime.UtcNow
            };

            db.Usuarios.Add(usuario);
            await db.SaveChangesAsync();

            return Results.Created($"/api/usuarios/{usuario.Id}", new
            {
                Message = Messages.Usuario.CadastroSucesso,
                Data = new
                {
                    usuario.Id,
                    usuario.Nome,
                    usuario.Email
                }
            });
        }).AllowAnonymous();

        group.MapPut("/{id}", async (int id, AtualizarUsuarioRequest request, AppDbContext db) =>
        {
            var usuario = await db.Usuarios.FindAsync(id);
            
            if (usuario is null)
            {
                return Results.NotFound(new { Message = Messages.Usuario.NaoEncontrado });
            }

            usuario.Nome = request.Nome;
            usuario.Email = request.Email;

            if (!string.IsNullOrEmpty(request.Senha))
            {
                usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.Senha);
            }

            await db.SaveChangesAsync();
            return Results.Ok(new
            {
                Message = Messages.Usuario.AtualizacaoSucesso,
                Data = new
                {
                    usuario.Id,
                    usuario.Nome,
                    usuario.Email
                }
            });
        });

        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var usuario = await db.Usuarios.FindAsync(id);
            
            if (usuario is null)
            {
                return Results.NotFound(new { Message = Messages.Usuario.NaoEncontrado });
            }

            db.Usuarios.Remove(usuario);
            await db.SaveChangesAsync();
            return Results.Ok(new { Message = Messages.Usuario.ExclusaoSucesso });
        });

        // POST /api/usuarios/admin - Cadastrar novo administrador
        group.MapPost("/admin", async (AdminRequest request, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuarioLogado = await db.Usuarios.FindAsync(userId);

            if (usuarioLogado == null || usuarioLogado.Tipo != TipoUsuario.Administrador)
            {
                return Results.Forbid();
            }

            if (await db.Usuarios.AnyAsync(u => u.Email == request.Email))
            {
                return Results.BadRequest(new { message = "Email já cadastrado" });
            }

            var novoAdmin = new Usuario
            {
                Nome = request.Nome,
                Email = request.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.Senha),
                Tipo = TipoUsuario.Administrador,
                DataCriacao = DateTime.UtcNow
            };

            db.Usuarios.Add(novoAdmin);
            await db.SaveChangesAsync();

            return Results.Created($"/api/usuarios/{novoAdmin.Id}", new
            {
                id = novoAdmin.Id,
                nome = novoAdmin.Nome,
                email = novoAdmin.Email,
                tipo = novoAdmin.Tipo.ToString()
            });
        });

        // GET /api/usuarios/admins - Listar administradores
        group.MapGet("/admins", async (AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuarioLogado = await db.Usuarios.FindAsync(userId);

            if (usuarioLogado == null || usuarioLogado.Tipo != TipoUsuario.Administrador)
            {
                return Results.Forbid();
            }

            var admins = await db.Usuarios
                .Where(u => u.Tipo == TipoUsuario.Administrador)
                .Select(u => new
                {
                    id = u.Id,
                    nome = u.Nome,
                    email = u.Email,
                    dataCriacao = u.DataCriacao
                })
                .ToListAsync();

            return Results.Ok(admins);
        });

        // GET /api/usuarios/operadores - Listar operadores
        group.MapGet("/operadores", async (AppDbContext db, ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

            var userId = int.Parse(userIdClaim);
            var usuarioLogado = await db.Usuarios.FindAsync(userId);

            if (usuarioLogado == null || usuarioLogado.Tipo != TipoUsuario.Administrador)
            {
                return Results.Forbid();
            }

            var operadores = await db.Usuarios
                .Where(u => u.Tipo == TipoUsuario.Operador)
                .Select(u => new
                {
                    id = u.Id,
                    nome = u.Nome,
                    email = u.Email,
                    dataCriacao = u.DataCriacao
                })
                .ToListAsync();

            return Results.Ok(operadores);
        });
    }
}

public class AdminRequest
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}
