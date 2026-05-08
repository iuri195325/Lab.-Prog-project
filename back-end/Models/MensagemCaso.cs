public class MensagemCaso
{
    public int Id { get; set; }
    public string Texto { get; set; } = string.Empty;
    public DateTime DataEnvio { get; set; } = DateTime.UtcNow;
    public string HoraEnvio { get; set; } = DateTime.Now.ToString("HH:mm");
    public string Remetente { get; set; } = "operador";

    // Relacionamentos
    public int CasoId { get; set; }
    public Caso Caso { get; set; } = null!;

    public int? UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }
}
