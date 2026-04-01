// src/components/Topbar.jsx
import { useState, useEffect } from 'react'
import './Topbar.css'

export default function Topbar() {
  const [hora, setHora] = useState('')
  const [data, setData] = useState('')

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

      {/* Logo e nome */}
      <div className="topbar-brand">
        <div className="brand-icon">✦</div>
        <h1>DISPATCHER<em>NET</em></h1>
      </div>

      {/* Centro: status ao vivo + relógio */}
      <div className="topbar-mid">
        <span className="live-indicator">
          <span className="live-dot" />
          AO VIVO
        </span>
        <span className="clock">{hora}</span>
        <span className="today">{data}</span>
      </div>

      {/* Direita: operador logado */}
      <div className="topbar-right">
        <span className="op-label">OP. CENTRAL</span>
        <div className="user-chip">
          <div className="user-avatar">OP</div>
          <span>operador</span>
        </div>
      </div>

    </header>
  )
}