public class Caso
{
    public int Id { get; set; }
    public string CodigoCaso { get; set; } = string.Empty;
    public string TipoCaso { get; set; } = string.Empty;
    public string Prioridade { get; set; } = "media";
    public string Status { get; set; } = "aberto";
    public string CodigoAnonimo { get; set; } = string.Empty;
    public DateTime DataAbertura { get; set; } = DateTime.UtcNow;
    public DateTime? DataFechamento { get; set; }
    public string Local { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;

    // Relacionamentos
    public int DenunciaOrigemId { get; set; }
    public Denuncia DenunciaOrigem { get; set; } = null!;

    public int? OperadorResponsavelId { get; set; }
    public Usuario? OperadorResponsavel { get; set; }

    // Vinculação com Viatura
    public int? ViaturaId { get; set; }
    public Viatura? Viatura { get; set; }
    public DateTime? DataVinculacaoViatura { get; set; }
    public int? UsuarioVinculacaoViaturaId { get; set; }
    public Usuario? UsuarioVinculacaoViatura { get; set; }

    public ICollection<MensagemCaso> Mensagens { get; set; } = new List<MensagemCaso>();
}
