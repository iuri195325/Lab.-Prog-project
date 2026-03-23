public static class Messages
{
    public static class Usuario
    {
        public const string CadastroSucesso = "Usuário cadastrado com sucesso";
        public const string AtualizacaoSucesso = "Usuário atualizado com sucesso";
        public const string ExclusaoSucesso = "Usuário excluído com sucesso";
        public const string NaoEncontrado = "Usuário não encontrado";
        public const string EmailJaCadastrado = "Email já cadastrado";
        public const string ListagemSucesso = "Usuários recuperados com sucesso";
    }

    public static class Auth
    {
        public const string LoginSucesso = "Login realizado com sucesso";
        public const string LoginFalha = "Email ou senha inválidos";
        public const string TokenInvalido = "Token inválido ou expirado";
        public const string NaoAutorizado = "Acesso não autorizado";
    }

    public static class Validacao
    {
        public const string CamposObrigatorios = "Todos os campos obrigatórios devem ser preenchidos";
        public const string EmailInvalido = "Email inválido";
        public const string SenhaFraca = "A senha deve ter no mínimo 6 caracteres";
    }
}
