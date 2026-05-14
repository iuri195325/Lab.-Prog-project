import { useState, useRef, useEffect, useCallback } from 'react'
import { casoService } from './src/services/casoService'
import './Chat.css'

export default function Chat({ casoId, onMensagemEnviada }) {
  const [texto, setTexto] = useState('')
  const [mensagens, setMensagens] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const ultimoCasoIdRef = useRef(null)
  const carregandoRef = useRef(false)

  const carregarMensagens = useCallback(async (id) => {
    if (carregandoRef.current) return
    carregandoRef.current = true
    
    try {
      setLoading(true)
      const response = await casoService.listarMensagens(id)
      const msgs = (response.data || []).map(m => ({
        id: m.id,
        de: m.remetente === 'operador' ? 'op' : 'denunciante',
        txt: m.texto,
        hora: m.horaEnvio
      }))
      
      // Só atualiza se ainda for o mesmo caso
      if (ultimoCasoIdRef.current === id) {
        setMensagens(msgs)
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    } finally {
      setLoading(false)
      carregandoRef.current = false
    }
  }, [])

  useEffect(() => {
    if (casoId && casoId !== ultimoCasoIdRef.current) {
      ultimoCasoIdRef.current = casoId
      carregarMensagens(casoId)
    } else if (!casoId && ultimoCasoIdRef.current !== null) {
      ultimoCasoIdRef.current = null
      setMensagens([])
    }
  }, [casoId, carregarMensagens])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [mensagens])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const mensagem = texto.trim()
    if (!mensagem || !casoId) return

    try {
      await casoService.enviarMensagem(casoId, mensagem)
      
      // Adicionar mensagem localmente
      const novaMensagem = {
        id: Date.now(),
        de: 'op',
        txt: mensagem,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
      setMensagens(prev => [...prev, novaMensagem])
      setTexto('')
      
      if (onMensagemEnviada) onMensagemEnviada()
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }

  return (
    <div className="chat-wrap">
      <div className="chat-hd">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        <span>Comunicação com Denunciante</span>
      </div>

      <div className="chat-msgs">
        {loading ? (
          <div className="chat-empty">Carregando mensagens...</div>
        ) : mensagens.length === 0 ? (
          <div className="chat-empty">Nenhuma mensagem ainda.</div>
        ) : (
          mensagens.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`msg ${msg.de === 'op' ? 'op' : 'denunciante'}`}
            >
              <div className="msg-bub">{msg.txt}</div>
              <div className="msg-meta">
                {msg.de === 'op' ? 'Você' : 'Denunciante'} · {msg.hora}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-inp"
          placeholder="Mensagem para o denunciante..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit" className="btn-send">
          ENVIAR
        </button>
      </form>
    </div>
  )
}