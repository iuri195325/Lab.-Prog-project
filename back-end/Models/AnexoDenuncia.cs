public class AnexoDenuncia
{
    public int Id { get; set; }
    public string TipoAnexo { get; set; } = string.Empty;
    public string CaminhoArquivo { get; set; } = string.Empty;
    public string NomeArquivo { get; set; } = string.Empty;
    public long TamanhoBytes { get; set; }
    public DateTime DataUpload { get; set; } = DateTime.UtcNow;

    // Relacionamentos
    public int DenunciaId { get; set; }
    public Denuncia Denuncia { get; set; } = null!;
}
