'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { usuario, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;

    if (!usuario) {
      router.push('/login');
      return;
    }

    if (usuario.nivel_acesso === 'cliente') {
      router.push('/chamados');
    } else {
      router.push('/dashboard');
    }
  }, [usuario, carregando, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3078AA] border-t-transparent" />
        <p className="text-sm text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
}
