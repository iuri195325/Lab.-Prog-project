import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { TIPOS_USUARIO } from '../utils/constants';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const response = await authService.login(email, senha);
    setUser(response.data);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user?.tipo === TIPOS_USUARIO.ADMINISTRADOR;
  };

  const isOperador = () => {
    return user?.tipo === TIPOS_USUARIO.OPERADOR;
  };

  const isCidadao = () => {
    return user?.tipo === TIPOS_USUARIO.CIDADAO;
  };

  const isOperadorOuAdmin = () => {
    return isOperador() || isAdmin();
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isOperador,
    isCidadao,
    isOperadorOuAdmin,
  };
};

export default useAuth;
