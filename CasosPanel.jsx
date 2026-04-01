// src/components/CasosPanel.jsx
import './CasosPanel.css'

export default function CasosPanel({ casos, casoSelecionado, onSelecionar }) {
  return (
    <div className="panel casos-panel">

      <div className="panel-hd">
        <h2>Casos Abertos</h2>
      </div>

      <div className="casos-scroll">
        {casos.map((c, i) => (
          <div
            key={c.id}
            className={`caso-item ${c.id === casoSelecionado ? 'ativo' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
            onClick={() => onSelecionar(c.id)}
          >
            <div className="ci-top">
              <span className="ci-id">{c.id}</span>
              <span className={`prio-dot ${c.prioridade}`} />
            </div>

            <div className="ci-meta">
              <span className={`tag ${c.tipo}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                {c.tipo}
              </span>
              <span className={`status-pill ${c.status}`}>
                {c.status.replace('_', ' ')}
              </span>
            </div>

            <span className="ci-anon">{c.anon}</span>
            <span className="ci-data">{c.data}</span>
          </div>
        ))}
      </div>

    </div>
  )
}