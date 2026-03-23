import {FaUser , FaLock, FaEnvelope, FaEye, FaEyeSlash} from 'react-icons/fa';
import { useState } from 'react';
import "./Registro.css";
import { authService } from '../../../services/authService';
import { toast } from 'react-toastify';


const Registro = ({ onVoltarLogin }) => {

    const[nome, setNome] = useState("");
    const[email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [senhaValida, setSenhaValida] = useState(true);
    const [mensagemSenha, setMensagemSenha] = useState("");

    const validarSenha = (senha) => {
        if (senha.length < 8) {
            setSenhaValida(false);
            setMensagemSenha("A senha deve ter no mínimo 8 caracteres");
            return false;
        }
        if (!/[A-Z]/.test(senha)) {
            setSenhaValida(false);
            setMensagemSenha("A senha deve conter pelo menos uma letra maiúscula");
            return false;
        }
        if (!/[a-z]/.test(senha)) {
            setSenhaValida(false);
            setMensagemSenha("A senha deve conter pelo menos uma letra minúscula");
            return false;
        }
        if (!/[0-9]/.test(senha)) {
            setSenhaValida(false);
            setMensagemSenha("A senha deve conter pelo menos um número");
            return false;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
            setSenhaValida(false);
            setMensagemSenha("A senha deve conter pelo menos um caractere especial");
            return false;
        }
        setSenhaValida(true);
        setMensagemSenha("");
        return true;
    };

    const handleSenhaChange = (e) => {
        const novaSenha = e.target.value;
        setSenha(novaSenha);
        if (novaSenha.length > 0) {
            validarSenha(novaSenha);
        } else {
            setSenhaValida(true);
            setMensagemSenha("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validarSenha(senha)) {
            toast.error(mensagemSenha, {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
        
        setLoading(true);

        try {
            const response = await authService.register(nome, email, senha);
            console.log('Cadastro bem-sucedido:', response);
            
            toast.success(`Cadastro realizado com sucesso! Bem-vindo, ${response.data.nome}!`, {
                position: "top-right",
                autoClose: 2000,
            });
            
            setTimeout(() => {
                onVoltarLogin();
            }, 2000);
        } catch (err) {
            toast.error(err.message || 'Erro ao fazer cadastro. Tente novamente.', {
                position: "top-right",
                autoClose: 3000,
            });
            console.error('Erro no cadastro:', err);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="container">
        <form onSubmit={handleSubmit}>
            <h1>Criar conta</h1>
            
            <div className='input-field'>
                <input 
                type="text" 
                placeholder="Nome completo" 
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={loading}
                />
                <FaUser className="icon"/>
            </div>

            <div className='input-field'>
                <input 
                type="email" 
                placeholder="E-mail" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                />
                <FaEnvelope className="icon"/>
            </div>

            <div className="input-field"> 
                <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha" 
                required
                value={senha}
                onChange={handleSenhaChange}
                disabled={loading}
                style={{borderColor: senha.length > 0 && !senhaValida ? '#ff4444' : ''}}
                />
                <div className="password-icons">
                    {mostrarSenha ? (
                        <FaEyeSlash className="icon-eye" onClick={() => setMostrarSenha(false)} />
                    ) : (
                        <FaEye className="icon-eye" onClick={() => setMostrarSenha(true)} />
                    )}
                </div>
            </div>
            {senha.length > 0 && !senhaValida && (
                <div className="senha-aviso">{mensagemSenha}</div>
            )}

            <button disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>

            <div className='signup-link'>
                <p>
                    Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); onVoltarLogin(); }}>Entrar</a>
                </p>
            </div>
        </form>

    </div>
  )
}

export default Registro
