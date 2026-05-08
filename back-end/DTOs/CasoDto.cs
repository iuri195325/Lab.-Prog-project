public class CriarCasoRequest
{
    public int DenunciaId { get; set; }
}

public class AtualizarCasoRequest
{
    public string Status { get; set; } = string.Empty;
    public int? OperadorResponsavelId { get; set; }
}

public class CasoResponse
{
    public int Id { get; set; }
    public string CodigoCaso { get; set; } = string.Empty;
    public string TipoCaso { get; set; } = string.Empty;
    public string Prioridade { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string CodigoAnonimo { get; set; } = string.Empty;
    public DateTime DataAbertura { get; set; }
    public DateTime? DataFechamento { get; set; }
    public string Local { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public int DenunciaOrigemId { get; set; }
    public int? OperadorResponsavelId { get; set; }
    public string? OperadorNome { get; set; }
    public ViaturaSimplesCaso? Viatura { get; set; }
    public List<MensagemResponse> Mensagens { get; set; } = new();
}

public class ViaturaSimplesCaso
{
    public int Id { get; set; }
    public string Placa { get; set; } = string.Empty;
    public string Identificacao { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class EnviarMensagemRequest
{
    public string Texto { get; set; } = string.Empty;
}

public class MensagemResponse
{
    public int Id { get; set; }
    public string Texto { get; set; } = string.Empty;
    public DateTime DataEnvio { get; set; }
    public string HoraEnvio { get; set; } = string.Empty;
    public string Remetente { get; set; } = string.Empty;
    public int? UsuarioId { get; set; }
    public string? UsuarioNome { get; set; }
}
