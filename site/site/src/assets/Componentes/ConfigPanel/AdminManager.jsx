import { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-toastify';
import './AdminManager.css';

export default function AdminManager() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  useEffect(() => {
    carregarAdmins();
  }, []);

  const carregarAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminService.listarAdmins();
      setAdmins(response.data || []);
    } catch (error) {
      toast.error('Erro ao carregar administradores');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.senha) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não conferem');
      return;
    }

    if (formData.senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      await adminService.criarAdmin({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha
      });
      toast.success('Administrador cadastrado com sucesso!');
      setFormData({ nome: '', email: '', senha: '', confirmarSenha: '' });
      setShowForm(false);
      carregarAdmins();
    } catch (error) {
      toast.error(error.message || 'Erro ao cadastrar administrador');
    }
  };

  return (
    <div className="admin-manager">
      <div className="section-header">
        <h2>Gerenciar Administradores</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Novo Administrador'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome Completo</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome do administrador"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirmar Senha</label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="Repita a senha"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Cadastrar</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="admin-list">
          {admins.length === 0 ? (
            <div className="empty-state">Nenhum administrador cadastrado</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Data de Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => (
                  <tr key={admin.id}>
                    <td>{admin.nome}</td>
                    <td>{admin.email}</td>
                    <td>{new Date(admin.dataCriacao).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
