public class Denuncia
{
    public int Id { get; set; }
    public string TipoDenuncia { get; set; } = string.Empty;
    public string Prioridade { get; set; } = "media";
    public string Local { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public string HoraCriacao { get; set; } = DateTime.Now.ToString("HH:mm");
    public bool Anonima { get; set; } = false;
    public string CodigoAnonimo { get; set; } = string.Empty;

    // Relacionamentos
    public int? UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    public int? CasoId { get; set; }
    public Caso? Caso { get; set; }

    public ICollection<AnexoDenuncia> Anexos { get; set; } = new List<AnexoDenuncia>();
}
