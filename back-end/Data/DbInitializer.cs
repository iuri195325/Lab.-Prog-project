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
        
        var usuarios = new[]
        {
            new Usuario
            {
                Nome = "Admin",
                Email = "admin@example.com",
                SenhaHash = BCrypt.Net.BCrypt.HashPassword("admin123")
            },
            new Usuario
            {
                Nome = "João Silva",
                Email = "joao@example.com",
                SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123")
            },
            new Usuario
            {
                Nome = "Maria Santos",
                Email = "maria@example.com",
                SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123")
            },
            new Usuario
            {
                Nome = "Pedro Oliveira",
                Email = "pedro@example.com",
                SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123")
            }
        };

        context.Usuarios.AddRange(usuarios);
        context.SaveChanges();

        Console.WriteLine("✅ Seed de usuários criado com sucesso!");
        Console.WriteLine("📧 Usuários disponíveis:");
        foreach (var usuario in usuarios)
        {
            Console.WriteLine($"   - {usuario.Email} (senha: senha123 ou admin123)");
        }
    }
}
