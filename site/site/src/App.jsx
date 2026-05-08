import './App.css'
import Login from './assets/Componentes/Login/Login';
import Registro from './assets/Componentes/Registro/Registro';
import MainSystem from './assets/Componentes/MainSystem/MainSystem';
import UserPanel from './components/user/UserPanel/UserPanel';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authService } from './services/authService';
import { TIPOS_USUARIO } from './utils/constants';

function App() {
  const [telaAtual, setTelaAtual] = useState('login');

  const handleLoginSucesso = () => {
    const user = authService.getUser();
    // Redirecionar baseado no tipo de usuário
    if (user?.tipo === TIPOS_USUARIO.CIDADAO) {
      setTelaAtual('user');
    } else {
      setTelaAtual('system');
    }
  };

  const renderizarTela = () => {
    switch (telaAtual) {
      case 'registro':
        return <Registro onVoltarLogin={() => setTelaAtual('login')} />;
      case 'system':
        return <MainSystem />;
      case 'user':
        return <UserPanel />;
      default:
        return <Login onIrParaRegistro={() => setTelaAtual('registro')} onLoginSucesso={handleLoginSucesso} />;
    }
  };

  return (
    <div className='App'>
      {renderizarTela()}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App
