import { useEffect } from 'react';
import { authService } from '../../../services/authService';
import { toast } from 'react-toastify';
import './Home.css';

const Home = () => {
  const user = authService.getUser();

  useEffect(() => {
    if (user) {
      toast.success(`Bem-vindo, ${user.nome}!`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.info('Você saiu da sua conta', {
      position: "top-right",
      autoClose: 2000,
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Bem-vindo ao Sistema!</h1>
        {user && (
          <div className="user-info">
            <h2>Olá, {user.nome}!</h2>
            <p>Email: {user.email}</p>
          </div>
        )}
        <button className="logout-button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
};

export default Home;
