// src/components/Taskbar.jsx
import { useState } from 'react'
import { VIATURAS, FONES } from '../data/mockData'
import './Taskbar.css'

export default function Taskbar() {
  const [modalAberto, setModalAberto] = useState(null) // 'mapa' | 'fones' | null

  return (
    <>
      <div className="taskbar">

        {/* Botão Mapa */}
        <button className="tb-btn" onClick={() => setModalAberto('mapa')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7"/>
          </svg>
          MAPA
        </button>

        {/* Botão Emergências */}
        <button className="tb-btn" onClick={() => setModalAberto('fones')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          EMERGÊNCIAS
        </button>

        <div className="tb-sep" />

        {/* Chips de viatura */}
        <div className="vtr-chips">
          {VIATURAS.map(v => (
            <div key={v.id} className="vtr" title={v.status}>
              <span className={`vtr-dot ${v.status}`} />
              <span>{v.id}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ── Modal Mapa ── */}
      {modalAberto === 'mapa' && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setModalAberto(null)}>
          <div className="modal">
            <h2>🗺 Mapa Operacional</h2>
            <div className="modal-map-box">
              [ Integração com mapa — Google Maps / Leaflet ]
            </div>
            <button className="btn-close" onClick={() => setModalAberto(null)}>FECHAR</button>
          </div>
        </div>
      )}

      {/* ── Modal Emergências ── */}
      {modalAberto === 'fones' && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setModalAberto(null)}>
          <div className="modal">
            <h2>📞 Contatos de Emergência</h2>
            <div className="ph-list">
              {FONES.map(f => (
                <div key={f.num} className="ph-item">
                  <span className="ph-ico">{f.ico}</span>
                  <span className="ph-name">{f.nome}</span>
                  <span className="ph-num">{f.num}</span>
                </div>
              ))}
            </div>
            <button className="btn-close" onClick={() => setModalAberto(null)}>FECHAR</button>
          </div>
        </div>
      )}
    </>
  )
}