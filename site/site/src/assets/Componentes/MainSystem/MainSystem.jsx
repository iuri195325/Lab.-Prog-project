import { useState, useEffect, useCallback } from 'react'
import { authService } from '../../../services/authService'
import { denunciaService } from '../../../services/denunciaService'
import { casoService } from '../../../services/casoService'
import { toast } from 'react-toastify'
import Topbar from '../../../../Topbar'
import InboxPanel from '../../../../InboxPanel'
import CasosPanel from '../../../../CasosPanel'
import DetailPanel from '../../../../DetailPanel'
import Taskbar from '../../../../Taskbar'
import ConfigPanel from '../ConfigPanel/ConfigPanel'
import './MainSystem.css'

export default function MainSystem() {
  const [denuncias, setDenuncias] = useState([])
  const [casos, setCasos] = useState([])
  const [casoSelecionado, setCasoSelecionado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfig, setShowConfig] = useState(false)
  const user = authService.getUser()
  const isAdmin = user?.tipoNome === 'Administrador'

  const carregarDados = async () => {
    try {
      setLoading(true)
      const [denunciasRes, casosRes] = await Promise.all([
        denunciaService.listarPendentes(),
        casoService.listar()
      ])
      
      // Mapear dados da API para o formato esperado pelos componentes
      const denunciasFormatadas = (denunciasRes.data || []).map(d => ({
        id: d.id,
        tipo: d.tipoDenuncia,
        prioridade: d.prioridade,
        local: d.local,
        desc: d.descricao,
        anexos: d.anexos || [],
        hora: d.horaCriacao
      }))
      
      const casosFormatados = (casosRes.data || []).map(c => ({
        id: c.id,
        codigoCaso: c.codigoCaso,
        tipo: c.tipoCaso,
        prioridade: c.prioridade,
        status: c.status,
        anon: c.codigoAnonimo,
        data: new Date(c.dataAbertura).toLocaleDateString('pt-BR'),
        local: c.local,
        desc: c.descricao,
        viatura: c.viatura,
        msgs: (c.mensagens || []).map(m => ({
          id: m.id,
          de: m.remetente === 'operador' ? 'op' : 'denunciante',
          txt: m.texto,
          hora: m.horaEnvio
        }))
      }))
      
      setDenuncias(denunciasFormatadas)
      setCasos(casosFormatados)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados do sistema')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      toast.success(`Sistema de DENÚNCIAS iniciado. Bem-vindo, ${user.nome}!`, {
        position: "top-right",
        autoClose: 3000,
      })
    }
    carregarDados()
  }, [])

  const handlePromoverDenuncia = useCallback(async (denunciaId) => {
    try {
      const response = await denunciaService.promoverParaCaso(denunciaId)
      
      toast.success(`Denúncia promovida para caso ${response.data.codigoCaso}`, {
        position: "top-right",
        autoClose: 2000,
      })
      
      // Recarregar dados
      await carregarDados()
      
      // Selecionar o novo caso
      setCasoSelecionado(response.data.id)
    } catch (error) {
      console.error('Erro ao promover denúncia:', error)
      toast.error('Erro ao promover denúncia para caso')
    }
  }, [])

  const handleSelecionarCaso = (casoId) => {
    setCasoSelecionado(casoId)
  }

  const casoAtual = casos.find(c => c.id === casoSelecionado)

  if (showConfig && isAdmin) {
    return <ConfigPanel onVoltar={() => setShowConfig(false)} />
  }

  return (
    <div className="main-system">
      <Topbar onConfig={isAdmin ? () => setShowConfig(true) : null} />
      
      <div className="system-layout">
        <InboxPanel 
          denuncias={denuncias} 
          onPromover={handlePromoverDenuncia} 
        />
        
        <CasosPanel 
          casos={casos}
          casoSelecionado={casoSelecionado}
          onSelecionar={handleSelecionarCaso}
        />
        
        <DetailPanel 
          caso={casoAtual}
          onViaturaVinculada={carregarDados}
        />
      </div>
      
      <Taskbar />
    </div>
  )
}
