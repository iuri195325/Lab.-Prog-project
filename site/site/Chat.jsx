import { useState, useEffect, useRef } from 'react'
import './Chat.css'

export default function Chat({ msgs, onEnviar }) {
  const [texto, setTexto] = useState('')
  const [mensagensLocais, setMensagensLocais] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    if (msgs) {
      setMensagensLocais(msgs)
    }
  }, [msgs])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagensLocais])

  function handleEnviar() {
    const t = texto.trim()
    if (!t) return
    onEnviar(t)
    setTexto('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleEnviar()
  }

  return (
    <div className="chat-wrap">

      <div className="chat-hd">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        <span>Comunicação com Denunciante</span>
      </div>

      <div className="chat-msgs">
        {mensagensLocais.length === 0 ? (
          <div className="chat-empty">Nenhuma mensagem ainda.</div>
        ) : (
          mensagensLocais.map((m, i) => (
            <div
              key={m.id || `${m.de}-${m.hora}-${i}`}
              className={`msg ${m.de}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="msg-bub">{m.txt}</div>
              <div className="msg-meta">
                {m.de === 'op' ? 'Você' : 'Denunciante'} · {m.hora}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="chat-inp"
          placeholder="Mensagem para o denunciante..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-send" onClick={handleEnviar}>
          ENVIAR
        </button>
      </div>

    </div>
  )
}