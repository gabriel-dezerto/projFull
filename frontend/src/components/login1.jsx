'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { toast } from 'sonner';
import Link from 'next/link';

export function Login1() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      await login(form.email, form.senha);
      toast.success('Login realizado com sucesso!');
    } catch (err) {
      toast.error(err.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#DFF2F9] px-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <Logo className="h-8 text-[#1a5276]" />
          <p className="text-sm text-slate-500">Sistema de Chamados de TI</p>
        </div>

        {/* Card de login */}
        <div className="w-full rounded-xl border border-blue-100 bg-white px-6 py-8 shadow-md">
          <h1 className="mb-6 text-center text-xl font-semibold text-[#1a5276]">
            Entrar na conta
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-slate-700">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                required
                className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="senha" className="text-slate-700">Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="••••••••"
                value={form.senha}
                onChange={handleChange}
                required
                className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]"
              />
            </div>

            <Button
              type="submit"
              disabled={carregando}
              className="mt-1 w-full bg-[#3078AA] hover:bg-[#2567a0] text-white"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>

        <p className="text-sm text-slate-500">
          Não tem uma conta?{' '}
          <Link href="/registro" className="font-medium text-[#3078AA] hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login1;
