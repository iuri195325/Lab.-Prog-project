import {FaUser , FaLock, FaEye, FaEyeSlash} from 'react-icons/fa';
import { useState } from 'react';
import "./Login.css";
import { authService } from '../../../services/authService';
import { toast } from 'react-toastify';


const Login = ({ onIrParaRegistro, onLoginSucesso }) => {

    const[username, setUsername] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login(username, password);
            console.log('Login bem-sucedido:', response);
            
            toast.success('Login realizado com sucesso!', {
                position: "top-right",
                autoClose: 1500,
            });
            
            setTimeout(() => {
                onLoginSucesso();
            }, 1500);
        } catch (err) {
            toast.error(err.message || 'Erro ao fazer login. Verifique suas credenciais.', {
                position: "top-right",
                autoClose: 3000,
            });
            console.error('Erro no login:', err);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="container">
        <form onSubmit={handleSubmit}>
            <h1>Acesse o sistema</h1>
            
            <div className='input-field'>
                <input 
                type="email" 
                placeholder="E-mail" 
                required
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                />
                <FaUser className="icon"/>
            </div>
            <div className="input-field"> 
                <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha" 
                onChange={(e) => setpassword(e.target.value)}
                disabled={loading}
                />
                <div className="password-icons">
                    {mostrarSenha ? (
                        <FaEyeSlash className="icon-eye" onClick={() => setMostrarSenha(false)} />
                    ) : (
                        <FaEye className="icon-eye" onClick={() => setMostrarSenha(true)} />
                    )}
                </div>
            </div>

            <div className='recall-forget'>
                <label>
                    <input type="checkbox" />
                    Lembre de mim
                </label>
                <a href="Esqueceu a senha ?"></a>
            </div>

            <button disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>

            <div className='signup-link'>
                <p>
                    Não tem uma conta ? <a href="#" onClick={(e) => { e.preventDefault(); onIrParaRegistro(); }}>Registrar</a>
                </p>
            </div>
        </form>

    </div>
  )
}

export default Login
