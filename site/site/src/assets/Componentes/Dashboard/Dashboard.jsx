import { useEffect } from 'react';
import { authService } from '../../../services/authService';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const user = authService.getUser();

  useEffect(() => {
    if (user) {
      toast.success(`Bem-vindo ao painel, ${user.nome}!`, {
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
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Painel de Controle</h1>
          <div className="user-menu">
            <span>Olá, {user?.nome}</span>
            <button className="logout-button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="card">
            <h3>Perfil do Usuário</h3>
            <div className="card-content">
              <p><strong>Nome:</strong> {user?.nome}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>ID:</strong> {user?.id}</p>
            </div>
          </div>

          <div className="card">
            <h3>Estatísticas</h3>
            <div className="card-content">
              <div className="stat-item">
                <span className="stat-number">1</span>
                <span className="stat-label">Usuário Ativo</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Sistema Online</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Ações Rápidas</h3>
            <div className="card-content">
              <button className="action-button">
                Editar Perfil
              </button>
              <button className="action-button">
                Configurações
              </button>
              <button className="action-button">
                Relatórios
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Atividade Recente</h3>
            <div className="card-content">
              <div className="activity-item">
                <span className="activity-time">Agora</span>
                <span className="activity-text">Login realizado com sucesso</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">Hoje</span>
                <span className="activity-text">Conta criada</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
