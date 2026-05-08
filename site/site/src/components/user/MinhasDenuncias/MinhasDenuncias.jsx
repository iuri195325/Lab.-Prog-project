import { TIPOS_DENUNCIA, PRIORIDADES, STATUS_CASO } from '../../../utils/constants';
import './MinhasDenuncias.css';

export default function MinhasDenuncias({ denuncias, loading, onRefresh, onEditar, onExcluir }) {
  const getTipoLabel = (value) => {
    return TIPOS_DENUNCIA.find(t => t.value === value)?.label || value;
  };

  const getPrioridadeInfo = (value) => {
    return PRIORIDADES.find(p => p.value === value) || { label: value, color: '#6b7280' };
  };

  const getStatusInfo = (value) => {
    return STATUS_CASO.find(s => s.value === value) || { label: value || 'Em análise', color: '#6b7280' };
  };

  const podeEditar = (denuncia) => {
    return !denuncia.casoId;
  };

  if (loading) {
    return (
      <div className="minhas-denuncias">
        <div className="loading">Carregando suas denúncias...</div>
      </div>
    );
  }

  return (
    <div className="minhas-denuncias">
      <div className="section-header">
        <h2>Minhas Denúncias</h2>
        <button className="btn-refresh" onClick={onRefresh}>
          Atualizar
        </button>
      </div>

      {denuncias.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhuma denúncia encontrada</h3>
          <p>Você ainda não registrou nenhuma denúncia.</p>
        </div>
      ) : (
        <div className="denuncias-list">
          {denuncias.map((denuncia) => {
            const prioInfo = getPrioridadeInfo(denuncia.prioridade);
            const statusInfo = getStatusInfo(denuncia.casoStatus);
            const editavel = podeEditar(denuncia);

            return (
              <div key={denuncia.id} className={`denuncia-card ${denuncia.prioridade}`}>
                <div className="card-header">
                  <div className="card-tags">
                    <span className={`tag tipo ${denuncia.tipoDenuncia}`}>
                      {getTipoLabel(denuncia.tipoDenuncia)}
                    </span>
                    <span 
                      className="tag prioridade"
                      style={{ backgroundColor: prioInfo.color }}
                    >
                      {prioInfo.label}
                    </span>
                    {denuncia.anonima && (
                      <span className="tag anonima">Anônima</span>
                    )}
                  </div>
                  <div className="card-actions">
                    {editavel ? (
                      <>
                        <button 
                          className="btn-action btn-edit"
                          onClick={() => onEditar(denuncia)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn-action btn-delete"
                          onClick={() => onExcluir(denuncia.id)}
                        >
                          Excluir
                        </button>
                      </>
                    ) : (
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: statusInfo.color }}
                      >
                        {denuncia.casoCodigo || statusInfo.label}
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-field">
                    <label>Local</label>
                    <p>{denuncia.local}</p>
                  </div>
                  <div className="info-field">
                    <label>Descrição</label>
                    <p className="desc">{denuncia.descricao}</p>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="footer-info">
                    <span className="code">{denuncia.codigoAnonimo}</span>
                    <span className="date">
                      {new Date(denuncia.dataCriacao).toLocaleDateString('pt-BR')} às {denuncia.horaCriacao}
                    </span>
                  </div>
                  {!editavel && (
                    <span className="caso-info">
                      Promovida para caso
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
