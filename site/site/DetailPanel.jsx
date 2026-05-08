// src/components/DetailPanel.jsx
import { useState, useEffect } from 'react'
import Chat from './Chat'
import { viaturaService } from './src/services/viaturaService'
import { casoService } from './src/services/casoService'
import { toast } from 'react-toastify'
import './DetailPanel.css'

export default function DetailPanel({ caso, onEnviarMsg, onViaturaVinculada }) {
  const [viaturasDisponiveis, setViaturasDisponiveis] = useState([])
  const [viaturaSelecionada, setViaturaSelecionada] = useState('')
  const [loadingViaturas, setLoadingViaturas] = useState(false)

  useEffect(() => {
    if (caso && !caso.viatura) {
      carregarViaturasDisponiveis()
    }
  }, [caso])

  const carregarViaturasDisponiveis = async () => {
    try {
      setLoadingViaturas(true)
      const response = await viaturaService.listarDisponiveis()
      setViaturasDisponiveis(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar viaturas:', error)
    } finally {
      setLoadingViaturas(false)
    }
  }

  const handleVincularViatura = async () => {
    if (!viaturaSelecionada) {
      toast.warning('Selecione uma viatura')
      return
    }

    try {
      await casoService.vincularViatura(caso.id, parseInt(viaturaSelecionada))
      toast.success('Viatura vinculada com sucesso!')
      setViaturaSelecionada('')
      if (onViaturaVinculada) onViaturaVinculada()
    } catch (error) {
      toast.error(error.message || 'Erro ao vincular viatura')
    }
  }

  const handleDesvincularViatura = async () => {
    try {
      await casoService.desvincularViatura(caso.id)
      toast.success('Viatura desvinculada!')
      if (onViaturaVinculada) onViaturaVinculada()
    } catch (error) {
      toast.error(error.message || 'Erro ao desvincular viatura')
    }
  }

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

        <div className="dv-header">
        <div className="dv-casoid">{caso.codigoCaso || caso.id}</div>
        <div className="dv-meta-row">

          <div className="dv-meta-item">
            <label>Prioridade</label>
            <span className={`prio-dot ${caso.prioridade}`} />
            <span>{caso.prioridade?.charAt(0).toUpperCase() + caso.prioridade?.slice(1)}</span>
          </div>

          <div className="dv-meta-item">
            <label>Status</label>
            <span className={`status-pill ${caso.status}`}>
              {caso.status?.replace('_', ' ')}
            </span>
          </div>

          <div className="dv-meta-item">
            <label>Tipo</label>
            <span className={`tag ${caso.tipo}`}>{caso.tipo}</span>
          </div>

        </div>
      </div>

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

        <div className="dv-viatura-section">
          <label>Viatura</label>
          {caso.viatura ? (
            <div className="viatura-vinculada">
              <span className="viatura-info">
                {caso.viatura.identificacao} - {caso.viatura.placa}
              </span>
              <button className="btn-desvincular" onClick={handleDesvincularViatura}>
                Desvincular
              </button>
            </div>
          ) : (
            <div className="viatura-vincular">
              <select 
                value={viaturaSelecionada} 
                onChange={(e) => setViaturaSelecionada(e.target.value)}
                disabled={loadingViaturas}
              >
                <option value="">
                  {loadingViaturas ? 'Carregando...' : 'Selecione uma viatura'}
                </option>
                {viaturasDisponiveis.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.identificacao} - {v.placa}
                  </option>
                ))}
              </select>
              <button 
                className="btn-vincular" 
                onClick={handleVincularViatura}
                disabled={!viaturaSelecionada}
              >
                Vincular
              </button>
            </div>
          )}
        </div>
      </div>

      <Chat msgs={caso.msgs} onEnviar={onEnviarMsg} />

    </div>
  )
}