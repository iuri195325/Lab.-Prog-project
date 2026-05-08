namespace DTOs;

public class ViaturaRequest
{
    public string Placa { get; set; } = string.Empty;
    public string Identificacao { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Observacoes { get; set; }
}

public class ViaturaResponse
{
    public int Id { get; set; }
    public string Placa { get; set; } = string.Empty;
    public string Identificacao { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Observacoes { get; set; }
    public DateTime DataCadastro { get; set; }
    public int CasosAtivos { get; set; }
}

public class ViaturaSimples
{
    public int Id { get; set; }
    public string Placa { get; set; } = string.Empty;
    public string Identificacao { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class VincularViaturaRequest
{
    public int ViaturaId { get; set; }
}
