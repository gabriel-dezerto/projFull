'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Logo } from '@/components/logo';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    nivel_acesso: 'cliente',
  });
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNivelChange = (value) => {
    setForm({ ...form, nivel_acesso: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      await authAPI.registro(form);
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      router.push('/login');
    } catch (error) {
      toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
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

        {/* Card de registro */}
        <div className="w-full rounded-xl border border-blue-100 bg-white px-6 py-8 shadow-md">
          <h1 className="mb-1 text-xl font-semibold text-[#1a5276]">Criar conta</h1>
          <p className="mb-6 text-sm text-slate-500">Preencha os dados para se registrar</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome" className="text-slate-700">Nome completo</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="João Silva"
                value={form.nome}
                onChange={handleChange}
                required
                className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-slate-700">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="joao@email.com"
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
                placeholder="Mínimo 6 caracteres"
                value={form.senha}
                onChange={handleChange}
                required
                minLength={6}
                className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700">
                Perfil
                <span className="ml-2 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  nível de acesso
                </span>
              </Label>
              <Select value={form.nivel_acesso} onValueChange={handleNivelChange}>
                <SelectTrigger className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={carregando}
              className="mt-1 w-full bg-[#3078AA] hover:bg-[#2567a0] text-white"
            >
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
        </div>

        <p className="text-sm text-slate-500">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-[#3078AA] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
