import { useState, useEffect } from 'react';
import { denunciaService } from '../../../services/denunciaService';
import { TIPOS_DENUNCIA, PRIORIDADES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import './DenunciaForm.css';

export default function DenunciaForm({ onSuccess, denunciaEditando, onCancelar }) {
  const [formData, setFormData] = useState({
    tipoDenuncia: '',
    prioridade: 'media',
    local: '',
    descricao: '',
    anonima: false,
  });
  const [loading, setLoading] = useState(false);

  const isEditando = !!denunciaEditando;

  useEffect(() => {
    if (denunciaEditando) {
      setFormData({
        tipoDenuncia: denunciaEditando.tipoDenuncia || '',
        prioridade: denunciaEditando.prioridade || 'media',
        local: denunciaEditando.local || '',
        descricao: denunciaEditando.descricao || '',
        anonima: denunciaEditando.anonima || false,
      });
    } else {
      setFormData({
        tipoDenuncia: '',
        prioridade: 'media',
        local: '',
        descricao: '',
        anonima: false,
      });
    }
  }, [denunciaEditando]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tipoDenuncia) {
      toast.error('Selecione o tipo de denúncia');
      return;
    }
    if (!formData.local || formData.local.length < 10) {
      toast.error('Informe o local com pelo menos 10 caracteres');
      return;
    }
    if (!formData.descricao || formData.descricao.length < 20) {
      toast.error('A descrição deve ter pelo menos 20 caracteres');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditando) {
        await denunciaService.atualizar(denunciaEditando.id, {
          tipoDenuncia: formData.tipoDenuncia,
          prioridade: formData.prioridade,
          local: formData.local,
          descricao: formData.descricao,
        });
      } else {
        await denunciaService.criar(formData);
      }
      
      setFormData({
        tipoDenuncia: '',
        prioridade: 'media',
        local: '',
        descricao: '',
        anonima: false,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.message || `Erro ao ${isEditando ? 'atualizar' : 'cadastrar'} denúncia`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="denuncia-form-container">
      <div className="form-header">
        <h2>{isEditando ? 'Editar Denúncia' : 'Nova Denúncia'}</h2>
        <p>{isEditando ? 'Atualize os dados da sua denúncia' : 'Preencha os dados abaixo para registrar sua denúncia'}</p>
      </div>

      <form onSubmit={handleSubmit} className="denuncia-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipoDenuncia">Tipo de Denúncia</label>
            <select
              id="tipoDenuncia"
              name="tipoDenuncia"
              value={formData.tipoDenuncia}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              {TIPOS_DENUNCIA.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="prioridade">Prioridade</label>
            <select
              id="prioridade"
              name="prioridade"
              value={formData.prioridade}
              onChange={handleChange}
              required
            >
              {PRIORIDADES.map(prio => (
                <option key={prio.value} value={prio.value}>
                  {prio.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="local">Local da Ocorrência</label>
          <input
            type="text"
            id="local"
            name="local"
            value={formData.local}
            onChange={handleChange}
            placeholder="Ex: Rua das Flores, 123 - Centro"
            required
            minLength={10}
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição Detalhada</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descreva o ocorrido com o máximo de detalhes possível..."
            rows={5}
            required
            minLength={20}
          />
          <span className="char-count">
            {formData.descricao.length}/20 caracteres mínimos
          </span>
        </div>

        {!isEditando && (
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="anonima"
                checked={formData.anonima}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Desejo fazer esta denúncia de forma anônima
            </label>
            <p className="checkbox-hint">
              {formData.anonima 
                ? 'Sua identidade será protegida. Você receberá um código para acompanhamento.'
                : 'Sua denúncia será vinculada à sua conta para acompanhamento.'}
            </p>
          </div>
        )}

        <div className="form-actions">
          {isEditando && (
            <button type="button" className="btn-cancel" onClick={onCancelar}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Salvando...' : (isEditando ? 'Salvar Alterações' : 'Enviar Denúncia')}
          </button>
        </div>
      </form>
    </div>
  );
}
