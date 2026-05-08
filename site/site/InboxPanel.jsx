import './InboxPanel.css'

export default function InboxPanel({ denuncias, onPromover }) {
  return (
    <div className="panel inbox-panel">

      <div className="panel-hd">
        <h2>Novas Denúncias</h2>
        {denuncias.length > 0 && (
          <span className="inbox-badge">{denuncias.length}</span>
        )}
      </div>

      <div className="inbox-scroll">
        {denuncias.length === 0 ? (
          <div className="inbox-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0l-8 5-8-5"/>
            </svg>
            <p>Nenhuma nova denúncia</p>
          </div>
        ) : (
          denuncias.map((d, i) => (
            <div
              key={d.id}
              className={`denuncia-card ${d.prioridade}`}
              style={{ animationDelay: `${i * 0.07}s` }}
              onClick={() => onPromover(d.id)}
              title="Clique para abrir como caso"
            >
              <div className="dc-top">
                <span className={`tag ${d.tipo}`}>{d.tipo}</span>
                <span className={`prio-dot ${d.prioridade}`} />
              </div>

              <div className="dc-local"> {d.local}</div>
              <div className="dc-desc">{d.desc}</div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}