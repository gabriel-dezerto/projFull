'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children, niveis = [] }) {
  const { usuario, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;

    if (!usuario) {
      router.push('/login');
      return;
    }

    if (niveis.length > 0 && !niveis.includes(usuario.nivel_acesso)) {
      if (usuario.nivel_acesso === 'cliente') {
        router.push('/chamados');
      } else {
        router.push('/dashboard');
      }
    }
  }, [usuario, carregando, niveis, router]);

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3078AA] border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) return null;

  if (niveis.length > 0 && !niveis.includes(usuario.nivel_acesso)) return null;

  return children;
}
