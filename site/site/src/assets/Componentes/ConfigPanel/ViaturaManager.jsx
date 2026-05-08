import { useState, useEffect } from 'react';
import { viaturaService } from '../../../services/viaturaService';
import { TIPOS_VIATURA, STATUS_VIATURA } from '../../../utils/constants';
import { toast } from 'react-toastify';
import './ViaturaManager.css';

export default function ViaturaManager() {
  const [viaturas, setViaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    placa: '',
    identificacao: '',
    tipo: 'Patrulha',
    status: 'Disponível',
    observacoes: ''
  });

  useEffect(() => {
    carregarViaturas();
  }, []);

  const carregarViaturas = async () => {
    try {
      setLoading(true);
      const response = await viaturaService.listar();
      setViaturas(response.data || []);
    } catch (error) {
      toast.error('Erro ao carregar viaturas');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      placa: '',
      identificacao: '',
      tipo: 'Patrulha',
      status: 'Disponível',
      observacoes: ''
    });
    setEditando(null);
    setShowForm(false);
  };

  const handleEditar = (viatura) => {
    setFormData({
      placa: viatura.placa,
      identificacao: viatura.identificacao,
      tipo: viatura.tipo,
      status: viatura.status,
      observacoes: viatura.observacoes || ''
    });
    setEditando(viatura.id);
    setShowForm(true);
  };

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta viatura?')) return;

    try {
      await viaturaService.deletar(id);
      toast.success('Viatura excluída com sucesso!');
      carregarViaturas();
    } catch (error) {
      toast.error(error.message || 'Erro ao excluir viatura');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.placa || !formData.identificacao) {
      toast.error('Preencha placa e identificação');
      return;
    }

    try {
      if (editando) {
        await viaturaService.atualizar(editando, formData);
        toast.success('Viatura atualizada com sucesso!');
      } else {
        await viaturaService.criar(formData);
        toast.success('Viatura cadastrada com sucesso!');
      }
      resetForm();
      carregarViaturas();
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar viatura');
    }
  };

  const getStatusColor = (status) => {
    const found = STATUS_VIATURA.find(s => s.value === status);
    return found?.color || '#888';
  };

  return (
    <div className="viatura-manager">
      <div className="section-header">
        <h2>Gerenciar Viaturas</h2>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancelar' : 'Nova Viatura'}
        </button>
      </div>

      {showForm && (
        <form className="viatura-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Placa</label>
              <input
                type="text"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                placeholder="ABC-1234"
                required
              />
            </div>
            <div className="form-group">
              <label>Identificação</label>
              <input
                type="text"
                name="identificacao"
                value={formData.identificacao}
                onChange={handleChange}
                placeholder="VTR-001"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange}>
                {TIPOS_VIATURA.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                {STATUS_VIATURA.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Observações sobre a viatura..."
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={resetForm}>Cancelar</button>
            <button type="submit" className="btn-primary">
              {editando ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="viatura-list">
          {viaturas.length === 0 ? (
            <div className="empty-state">Nenhuma viatura cadastrada</div>
          ) : (
            <div className="viatura-grid">
              {viaturas.map(viatura => (
                <div key={viatura.id} className="viatura-card">
                  <div className="viatura-header">
                    <span className="viatura-id">{viatura.identificacao}</span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(viatura.status) }}
                    >
                      {viatura.status}
                    </span>
                  </div>
                  <div className="viatura-body">
                    <div className="info-row">
                      <span className="label">Placa:</span>
                      <span className="value">{viatura.placa}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Tipo:</span>
                      <span className="value">{viatura.tipo}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Casos Ativos:</span>
                      <span className="value">{viatura.casosAtivos || 0}</span>
                    </div>
                    {viatura.observacoes && (
                      <div className="info-row">
                        <span className="label">Obs:</span>
                        <span className="value obs">{viatura.observacoes}</span>
                      </div>
                    )}
                  </div>
                  <div className="viatura-actions">
                    <button className="btn-edit" onClick={() => handleEditar(viatura)}>
                      Editar
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleExcluir(viatura.id)}
                      disabled={viatura.casosAtivos > 0}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
