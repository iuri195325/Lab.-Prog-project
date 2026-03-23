using Microsoft.EntityFrameworkCore;

public static class UsuariosEndpoints
{
    public static void MapUsuariosEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/usuarios")
            .WithTags("Usuários")
            .RequireAuthorization();

        group.MapGet("/", async (AppDbContext db) =>
        {
            var usuarios = await db.Usuarios.ToListAsync();
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
                Data = usuario
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
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.Senha)
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
    }
}
