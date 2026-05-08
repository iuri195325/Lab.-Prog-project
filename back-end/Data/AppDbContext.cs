using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Denuncia> Denuncias => Set<Denuncia>();
    public DbSet<Caso> Casos => Set<Caso>();
    public DbSet<MensagemCaso> MensagensCaso => Set<MensagemCaso>();
    public DbSet<AnexoDenuncia> AnexosDenuncia => Set<AnexoDenuncia>();
    public DbSet<Viatura> Viaturas => Set<Viatura>();

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Usuario
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
        });

        // Denuncia
        modelBuilder.Entity<Denuncia>(entity =>
        {
            entity.HasIndex(d => d.CodigoAnonimo).IsUnique();
            
            entity.HasOne(d => d.Usuario)
                .WithMany(u => u.Denuncias)
                .HasForeignKey(d => d.UsuarioId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Caso
        modelBuilder.Entity<Caso>(entity =>
        {
            entity.HasIndex(c => c.CodigoCaso).IsUnique();

            entity.HasOne(c => c.DenunciaOrigem)
                .WithOne(d => d.Caso)
                .HasForeignKey<Caso>(c => c.DenunciaOrigemId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.OperadorResponsavel)
                .WithMany(u => u.CasosGerenciados)
                .HasForeignKey(c => c.OperadorResponsavelId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // MensagemCaso
        modelBuilder.Entity<MensagemCaso>(entity =>
        {
            entity.HasOne(m => m.Caso)
                .WithMany(c => c.Mensagens)
                .HasForeignKey(m => m.CasoId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(m => m.Usuario)
                .WithMany(u => u.Mensagens)
                .HasForeignKey(m => m.UsuarioId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // AnexoDenuncia
        modelBuilder.Entity<AnexoDenuncia>(entity =>
        {
            entity.HasOne(a => a.Denuncia)
                .WithMany(d => d.Anexos)
                .HasForeignKey(a => a.DenunciaId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Viatura
        modelBuilder.Entity<Viatura>(entity =>
        {
            entity.HasIndex(v => v.Placa).IsUnique();
            entity.HasIndex(v => v.Identificacao).IsUnique();
        });

        // Caso - Viatura relationship
        modelBuilder.Entity<Caso>()
            .HasOne(c => c.Viatura)
            .WithMany(v => v.Casos)
            .HasForeignKey(c => c.ViaturaId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Caso>()
            .HasOne(c => c.UsuarioVinculacaoViatura)
            .WithMany()
            .HasForeignKey(c => c.UsuarioVinculacaoViaturaId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}