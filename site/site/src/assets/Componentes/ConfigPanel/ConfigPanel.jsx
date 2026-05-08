import { useState } from 'react';
import { authService } from '../../../services/authService';
import { toast } from 'react-toastify';
import AdminManager from './AdminManager';
import ViaturaManager from './ViaturaManager';
import ReportsPanel from './ReportsPanel';
import './ConfigPanel.css';

export default function ConfigPanel({ onVoltar }) {
  const [activeTab, setActiveTab] = useState('admins');
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    toast.info('Você saiu da sua conta');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="config-panel">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="brand-icon">D</span>
          <h1>CONFIGURAÇÕES DO <em>SISTEMA</em></h1>
        </div>

        <div className="topbar-mid">
          <button className="btn-voltar" onClick={onVoltar}>
            Voltar ao Painel
          </button>
        </div>

        <div className="topbar-right">
          <div className="user-chip">
            <div className="user-avatar">{user?.nome?.charAt(0) || 'A'}</div>
            <span>{user?.nome}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <div className="config-layout">
        <aside className="config-sidebar">
          <nav className="config-nav">
            <button
              className={`nav-item ${activeTab === 'admins' ? 'active' : ''}`}
              onClick={() => setActiveTab('admins')}
            >
              Administradores
            </button>
            <button
              className={`nav-item ${activeTab === 'viaturas' ? 'active' : ''}`}
              onClick={() => setActiveTab('viaturas')}
            >
              Viaturas
            </button>
            <button
              className={`nav-item ${activeTab === 'relatorios' ? 'active' : ''}`}
              onClick={() => setActiveTab('relatorios')}
            >
              Relatórios
            </button>
          </nav>
        </aside>

        <main className="config-content">
          {activeTab === 'admins' && <AdminManager />}
          {activeTab === 'viaturas' && <ViaturaManager />}
          {activeTab === 'relatorios' && <ReportsPanel />}
        </main>
      </div>
    </div>
  );
}
