'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const dadosStr = localStorage.getItem('usuario');

    if (token && dadosStr) {
      try {
        const dados = JSON.parse(dadosStr);
        setUsuario(dados);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
    setCarregando(false);
  }, []);

  const login = async (email, senha) => {
    const data = await authAPI.login({ email, senha });

    localStorage.setItem('token', data.token);

    // Decodifica o payload do JWT
    const payload = JSON.parse(atob(data.token.split('.')[1]));
    localStorage.setItem('usuario', JSON.stringify(payload));
    setUsuario(payload);

    // Redireciona conforme o nível de acesso
    if (payload.nivel_acesso === 'admin' || payload.nivel_acesso === 'tecnico') {
      router.push('/dashboard');
    } else {
      router.push('/chamados');
    }

    return payload;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
