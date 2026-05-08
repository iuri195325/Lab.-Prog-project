import { useState, useEffect } from 'react';
import { authService } from '../../../services/authService';
import { denunciaService } from '../../../services/denunciaService';
import { toast } from 'react-toastify';
import DenunciaForm from '../DenunciaForm/DenunciaForm';
import MinhasDenuncias from '../MinhasDenuncias/MinhasDenuncias';
import './UserPanel.css';

export default function UserPanel() {
  const [activeTab, setActiveTab] = useState('minhas');
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [denunciaEditando, setDenunciaEditando] = useState(null);
  const user = authService.getUser();

  useEffect(() => {
    if (user) {
      toast.success(`Bem-vindo, ${user.nome}!`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    carregarDenuncias();
  }, []);

  const carregarDenuncias = async () => {
    try {
      setLoading(true);
      const response = await denunciaService.minhasDenuncias();
      setDenuncias(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar denúncias:', error);
      toast.error('Erro ao carregar denúncias');
    } finally {
      setLoading(false);
    }
  };

  const handleDenunciaCriada = (novaDenuncia) => {
    carregarDenuncias();
    setActiveTab('minhas');
    setDenunciaEditando(null);
    toast.success('Denúncia cadastrada com sucesso!');
  };

  const handleDenunciaAtualizada = () => {
    carregarDenuncias();
    setActiveTab('minhas');
    setDenunciaEditando(null);
    toast.success('Denúncia atualizada com sucesso!');
  };

  const handleEditar = (denuncia) => {
    setDenunciaEditando(denuncia);
    setActiveTab('nova');
  };

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta denúncia?')) return;
    
    try {
      await denunciaService.deletar(id);
      toast.success('Denúncia excluída com sucesso!');
      carregarDenuncias();
    } catch (error) {
      toast.error(error.message || 'Erro ao excluir denúncia');
    }
  };

  const handleCancelarEdicao = () => {
    setDenunciaEditando(null);
    setActiveTab('minhas');
  };

  const handleLogout = () => {
    authService.logout();
    toast.info('Você saiu da sua conta');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="user-system">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="brand-icon">D</span>
          <h1>SISTEMA DE <em>DENÚNCIAS</em></h1>
        </div>

        <div className="topbar-mid">
          <div className="user-type-badge">CIDADÃO</div>
        </div>

        <div className="topbar-right">
          <div className="user-chip">
            <div className="user-avatar">{user?.nome?.charAt(0) || 'U'}</div>
            <span>{user?.nome}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <div className="system-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'minhas' ? 'active' : ''}`}
              onClick={() => { setActiveTab('minhas'); setDenunciaEditando(null); }}
            >
              Minhas Denúncias
              {denuncias.length > 0 && <span className="nav-badge">{denuncias.length}</span>}
            </button>
            <button
              className={`nav-item ${activeTab === 'nova' ? 'active' : ''}`}
              onClick={() => { setActiveTab('nova'); setDenunciaEditando(null); }}
            >
              {denunciaEditando ? 'Editar Denúncia' : 'Nova Denúncia'}
            </button>
          </nav>
        </aside>

        <main className="main-content">
          {activeTab === 'nova' && (
            <DenunciaForm 
              onSuccess={denunciaEditando ? handleDenunciaAtualizada : handleDenunciaCriada}
              denunciaEditando={denunciaEditando}
              onCancelar={handleCancelarEdicao}
            />
          )}
          {activeTab === 'minhas' && (
            <MinhasDenuncias
              denuncias={denuncias}
              loading={loading}
              onRefresh={carregarDenuncias}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
            />
          )}
        </main>
      </div>
    </div>
  );
}
