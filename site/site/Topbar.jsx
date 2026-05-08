// src/components/Topbar.jsx
import { useState, useEffect } from 'react'
import { authService } from './src/services/authService'
import './Topbar.css'

export default function Topbar({ onConfig }) {
  const [hora, setHora] = useState('')
  const [data, setData] = useState('')
  const user = authService.getUser()

  useEffect(() => {
    function tick() {
      const n = new Date()
      setHora(n.toLocaleTimeString('pt-BR'))
      setData(n.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="brand-icon">D</div>
        <h1>SISTEMA DE <em>DENUNCIAS</em></h1>
      </div>
      <div className="topbar-mid">
        <span className="live-indicator">
          <span className="live-dot" />
          AO VIVO
        </span>
        <span className="clock">{hora}</span>
        <span className="today">{data}</span>
      </div>
      <div className="topbar-right">
        {onConfig && (
          <button className="btn-config" onClick={onConfig}>
            Configuracoes
          </button>
        )}
        <span className="op-label">{user?.tipoNome || 'OPERADOR'}</span>
        <div className="user-chip">
          <div className="user-avatar">{user?.nome?.charAt(0) || 'U'}</div>
          <span>{user?.nome || 'Usuario'}</span>
        </div>
      </div>

    </header>
  )
}