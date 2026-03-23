import './App.css'
import Login from './assets/Componentes/Login/Login';
import Registro from './assets/Componentes/Registro/Registro';
import Home from './assets/Componentes/Home/Home';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [telaAtual, setTelaAtual] = useState('login');

  const renderizarTela = () => {
    switch (telaAtual) {
      case 'registro':
        return <Registro onVoltarLogin={() => setTelaAtual('login')} />;
      case 'home':
        return <Home />;
      default:
        return <Login onIrParaRegistro={() => setTelaAtual('registro')} onLoginSucesso={() => setTelaAtual('home')} />;
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
        theme="light"
      />
    </div>
  );
}

export default App
