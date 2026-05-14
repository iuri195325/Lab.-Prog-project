import { useState, useEffect, useRef } from 'react';
import { casoService } from '../../../services/casoService';
import { toast } from 'react-toastify';
import './MeusCasos.css';

export default function MeusCasos() {
  const [casos, setCasos] = useState([]);
  const [casoSelecionado, setCasoSelecionado] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    carregarCasos();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensagens]);

  const carregarCasos = async () => {
    try {
      setLoading(true);
      const response = await casoService.listar();
      setCasos(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar casos:', error);
      toast.error('Erro ao carregar casos');
    } finally {
      setLoading(false);
    }
  };

  const selecionarCaso = async (caso) => {
    setCasoSelecionado(caso);
    try {
      const response = await casoService.listarMensagens(caso.id);
      setMensagens(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setMensagens([]);
    }
  };

  const enviarMensagem = async () => {
    if (!novaMsg.trim() || !casoSelecionado) return;

    try {
      setEnviando(true);
      await casoService.enviarMensagem(casoSelecionado.id, novaMsg.trim());
      
      // Adicionar mensagem localmente
      const novaMensagem = {
        id: Date.now(),
        texto: novaMsg.trim(),
        remetente: 'denunciante',
        horaEnvio: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        dataEnvio: new Date().toISOString()
      };
      
      setMensagens(prev => [...prev, novaMensagem]);
      setNovaMsg('');
      toast.success('Mensagem enviada!');
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'aberto': '#3498db',
      'em_andamento': '#f39c12',
      'resolvido': '#27ae60',
      'finalizado': '#27ae60',
      'fechado': '#95a5a6'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="meus-casos">
        <div className="loading">Carregando seus casos...</div>
      </div>
    );
  }

  return (
    <div className="meus-casos">
      <div className="casos-container">
        {/* Lista de Casos */}
        <div className="casos-lista">
          <div className="lista-header">
            <h2>Meus Casos</h2>
            <button className="btn-refresh" onClick={carregarCasos}>
              Atualizar
            </button>
          </div>

          {casos.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum caso encontrado.</p>
              <small>Quando sua denúncia for promovida para caso, aparecerá aqui.</small>
            </div>
          ) : (
            <div className="casos-scroll">
              {casos.map((caso) => (
                <div
                  key={caso.id}
                  className={`caso-item ${casoSelecionado?.id === caso.id ? 'ativo' : ''}`}
                  onClick={() => selecionarCaso(caso)}
                >
                  <div className="caso-header">
                    <span className="caso-codigo">{caso.codigoCaso}</span>
                    <span 
                      className="caso-status"
                      style={{ backgroundColor: getStatusColor(caso.status) }}
                    >
                      {caso.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="caso-info">
                    <span className="caso-tipo">{caso.tipoCaso}</span>
                    <span className="caso-data">
                      {new Date(caso.dataAbertura).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat do Caso */}
        <div className="caso-chat">
          {!casoSelecionado ? (
            <div className="chat-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <p>Selecione um caso para ver as mensagens</p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-caso-info">
                  <h3>{casoSelecionado.codigoCaso}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(casoSelecionado.status) }}
                  >
                    {casoSelecionado.status?.replace('_', ' ')}
                  </span>
                </div>
                <small>Comunicação com o operador</small>
              </div>

              <div className="chat-messages" ref={chatRef}>
                {mensagens.length === 0 ? (
                  <div className="chat-empty">
                    <p>Nenhuma mensagem ainda.</p>
                    <small>Envie uma mensagem para o operador responsável.</small>
                  </div>
                ) : (
                  mensagens.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message ${msg.remetente === 'denunciante' ? 'enviada' : 'recebida'}`}
                    >
                      <div className="message-bubble">
                        {msg.texto}
                      </div>
                      <div className="message-meta">
                        {msg.remetente === 'denunciante' ? 'Você' : 'Operador'} · {msg.horaEnvio}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={novaMsg}
                  onChange={(e) => setNovaMsg(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={enviando || casoSelecionado.status === 'finalizado' || casoSelecionado.status === 'fechado'}
                />
                <button 
                  className="btn-enviar"
                  onClick={enviarMensagem}
                  disabled={!novaMsg.trim() || enviando || casoSelecionado.status === 'finalizado' || casoSelecionado.status === 'fechado'}
                >
                  {enviando ? 'Enviando...' : 'Enviar'}
                </button>
              </div>

              {(casoSelecionado.status === 'finalizado' || casoSelecionado.status === 'fechado') && (
                <div className="chat-closed">
                  Este caso foi finalizado. Não é possível enviar novas mensagens.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
