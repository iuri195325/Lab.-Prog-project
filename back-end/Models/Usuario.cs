public enum TipoUsuario
{
    Cidadao = 0,
    Operador = 1,
    Administrador = 2
}

public class Usuario
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public TipoUsuario Tipo { get; set; } = TipoUsuario.Cidadao;
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    // Relacionamentos
    public ICollection<Denuncia> Denuncias { get; set; } = new List<Denuncia>();
    public ICollection<Caso> CasosGerenciados { get; set; } = new List<Caso>();
    public ICollection<MensagemCaso> Mensagens { get; set; } = new List<MensagemCaso>();
}