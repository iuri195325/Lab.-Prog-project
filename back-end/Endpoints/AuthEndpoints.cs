using Microsoft.EntityFrameworkCore;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Autenticação");

        group.MapPost("/login", async (LoginRequest request, AppDbContext db, JwtService jwtService) =>
        {
            var usuario = await db.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario is null)
            {
                return Results.Json(
                    new { Message = Messages.Auth.LoginFalha },
                    statusCode: 401
                );
            }

            bool senhaValida = VerificarSenha(request.Senha, usuario.SenhaHash);

            if (!senhaValida)
            {
                return Results.Json(
                    new { Message = Messages.Auth.LoginFalha },
                    statusCode: 401
                );
            }

            var token = jwtService.GerarToken(usuario);

            return Results.Ok(new
            {
                Message = Messages.Auth.LoginSucesso,
                Data = new
                {
                    usuario.Id,
                    usuario.Nome,
                    usuario.Email,
                    Token = token
                }
            });
        });
    }

    private static bool VerificarSenha(string senha, string senhaHash)
    {
        return BCrypt.Net.BCrypt.Verify(senha, senhaHash);
    }
}
