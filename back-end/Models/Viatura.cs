public class Viatura
{
    public int Id { get; set; }
    public string Placa { get; set; } = string.Empty;
    public string Identificacao { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Observacoes { get; set; }
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
    
    public ICollection<Caso> Casos { get; set; } = new List<Caso>();
}
