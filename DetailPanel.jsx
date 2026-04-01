// src/components/DetailPanel.jsx
import Chat from './Chat'
import './DetailPanel.css'

export default function DetailPanel({ caso, onEnviarMsg }) {
  // Nenhum caso selecionado → placeholder
  if (!caso) {
    return (
      <div className="detail-panel detail-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p>Selecione um caso para ver os detalhes</p>
      </div>
    )
  }

  return (
    <div className="detail-panel detail-view">

      {/* ── Cabeçalho do caso ── */}
      <div className="dv-header">
        <div className="dv-casoid">{caso.id}</div>
        <div className="dv-meta-row">

          <div className="dv-meta-item">
            <label>Prioridade</label>
            <span className={`prio-dot ${caso.prioridade}`} />
            <span>{caso.prioridade.charAt(0).toUpperCase() + caso.prioridade.slice(1)}</span>
          </div>

          <div className="dv-meta-item">
            <label>Status</label>
            <span className={`status-pill ${caso.status}`}>
              {caso.status.replace('_', ' ')}
            </span>
          </div>

          <div className="dv-meta-item">
            <label>Tipo</label>
            <span className={`tag ${caso.tipo}`}>{caso.tipo}</span>
          </div>

        </div>
      </div>

      {/* ── Informações do caso ── */}
      <div className="dv-info">
        <div className="dv-grid">
          <div className="info-field">
            <label>Local</label>
            <p>{caso.local}</p>
          </div>
          <div className="info-field">
            <label>Data de abertura</label>
            <p>{caso.data}</p>
          </div>
          <div className="info-field">
            <label>Denunciante (anônimo)</label>
            <p className="anon-id">{caso.anon}</p>
          </div>
          <div className="info-field">
            <label>Descrição</label>
            <p>{caso.desc}</p>
          </div>
        </div>
      </div>

      {/* ── Chat ── */}
      <Chat msgs={caso.msgs} onEnviar={onEnviarMsg} />

    </div>
  )
}