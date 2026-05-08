import { useState, useEffect } from 'react';
import { relatorioService } from '../../../services/relatorioService';
import { toast } from 'react-toastify';
import './ReportsPanel.css';

export default function ReportsPanel() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes');

  useEffect(() => {
    carregarDashboard();
  }, [periodo]);

  const calcularDatas = () => {
    const hoje = new Date();
    let dataInicio;

    switch (periodo) {
      case 'hoje':
        dataInicio = new Date(hoje.setHours(0, 0, 0, 0));
        break;
      case 'semana':
        dataInicio = new Date(hoje.setDate(hoje.getDate() - 7));
        break;
      case 'mes':
        dataInicio = new Date(hoje.setMonth(hoje.getMonth() - 1));
        break;
      case 'ano':
        dataInicio = new Date(hoje.setFullYear(hoje.getFullYear() - 1));
        break;
      default:
        dataInicio = new Date(hoje.setMonth(hoje.getMonth() - 1));
    }

    return {
      dataInicio: dataInicio.toISOString().split('T')[0],
      dataFim: new Date().toISOString().split('T')[0]
    };
  };

  const carregarDashboard = async () => {
    try {
      setLoading(true);
      const { dataInicio, dataFim } = calcularDatas();
      const response = await relatorioService.dashboard(dataInicio, dataFim);
      console.log('Dashboard response:', response);
      setDashboard(response.data || response);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="reports-panel"><div className="loading">Carregando relatórios...</div></div>;
  }

  if (!dashboard) {
    return (
      <div className="reports-panel">
        <div className="empty-state">
          <p>Nenhum dado disponível</p>
          <button className="btn-retry" onClick={carregarDashboard}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-panel">
      <div className="section-header">
        <h2>Relatórios e Estatísticas</h2>
        <div className="periodo-selector">
          <button 
            className={periodo === 'hoje' ? 'active' : ''} 
            onClick={() => setPeriodo('hoje')}
          >
            Hoje
          </button>
          <button 
            className={periodo === 'semana' ? 'active' : ''} 
            onClick={() => setPeriodo('semana')}
          >
            Semana
          </button>
          <button 
            className={periodo === 'mes' ? 'active' : ''} 
            onClick={() => setPeriodo('mes')}
          >
            Mês
          </button>
          <button 
            className={periodo === 'ano' ? 'active' : ''} 
            onClick={() => setPeriodo('ano')}
          >
            Ano
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-value">{dashboard.totalDenuncias ?? 0}</div>
          <div className="stat-label">Total de Denúncias</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value">{dashboard.totalCasos ?? 0}</div>
          <div className="stat-label">Total de Casos</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-value">{dashboard.tempoMedioResposta ?? 'N/A'}</div>
          <div className="stat-label">Tempo Médio de Resposta</div>
        </div>
      </div>

      <div className="reports-row">
        <div className="report-card">
          <h3>Denúncias por Tipo</h3>
          <div className="report-list">
            {dashboard.denunciasPorTipo && Object.keys(dashboard.denunciasPorTipo).length > 0 ? (
              Object.entries(dashboard.denunciasPorTipo).map(([tipo, count]) => (
                <div key={tipo} className="report-item">
                  <span className="item-label">{tipo}</span>
                  <span className="item-value">{count}</span>
                </div>
              ))
            ) : (
              <div className="empty-list">Sem dados no período</div>
            )}
          </div>
        </div>

        <div className="report-card">
          <h3>Denúncias por Prioridade</h3>
          <div className="report-list">
            {dashboard.denunciasPorPrioridade && Object.keys(dashboard.denunciasPorPrioridade).length > 0 ? (
              Object.entries(dashboard.denunciasPorPrioridade).map(([prio, count]) => (
                <div key={prio} className="report-item">
                  <span className={`item-label prio-${prio}`}>{prio}</span>
                  <span className="item-value">{count}</span>
                </div>
              ))
            ) : (
              <div className="empty-list">Sem dados no período</div>
            )}
          </div>
        </div>

        <div className="report-card">
          <h3>Casos por Status</h3>
          <div className="report-list">
            {dashboard.casosPorStatus && Object.keys(dashboard.casosPorStatus).length > 0 ? (
              Object.entries(dashboard.casosPorStatus).map(([status, count]) => (
                <div key={status} className="report-item">
                  <span className="item-label">{status.replace('_', ' ')}</span>
                  <span className="item-value">{count}</span>
                </div>
              ))
            ) : (
              <div className="empty-list">Sem dados no período</div>
            )}
          </div>
        </div>
      </div>

      <div className="reports-row">
        <div className="report-card">
          <h3>Viaturas Mais Utilizadas</h3>
          <div className="report-list">
            {dashboard.viaturasMaisUtilizadas?.length > 0 ? (
              dashboard.viaturasMaisUtilizadas.map((v, i) => (
                <div key={i} className="report-item">
                  <span className="item-label">{v.identificacao}</span>
                  <span className="item-value">{v.casosAtendidos} casos</span>
                </div>
              ))
            ) : (
              <div className="empty-list">Nenhuma viatura utilizada</div>
            )}
          </div>
        </div>

        <div className="report-card">
          <h3>Operadores Mais Ativos</h3>
          <div className="report-list">
            {dashboard.operadoresMaisAtivos?.length > 0 ? (
              dashboard.operadoresMaisAtivos.map((op, i) => (
                <div key={i} className="report-item">
                  <span className="item-label">{op.nome}</span>
                  <span className="item-value">{op.casosGerenciados} casos</span>
                </div>
              ))
            ) : (
              <div className="empty-list">Nenhum operador ativo</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
