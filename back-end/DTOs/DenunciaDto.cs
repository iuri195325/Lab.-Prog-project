public class CadastrarDenunciaRequest
{
    public string TipoDenuncia { get; set; } = string.Empty;
    public string Prioridade { get; set; } = "media";
    public string Local { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public bool Anonima { get; set; } = false;
}

public class AtualizarDenunciaRequest
{
    public string TipoDenuncia { get; set; } = string.Empty;
    public string Prioridade { get; set; } = "media";
    public string Local { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
}

public class DenunciaResponse
{
    public int Id { get; set; }
    public string TipoDenuncia { get; set; } = string.Empty;
    public string Prioridade { get; set; } = string.Empty;
    public string Local { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public DateTime DataCriacao { get; set; }
    public string HoraCriacao { get; set; } = string.Empty;
    public bool Anonima { get; set; }
    public string CodigoAnonimo { get; set; } = string.Empty;
    public int? UsuarioId { get; set; }
    public int? CasoId { get; set; }
    public List<string> Anexos { get; set; } = new();
}
