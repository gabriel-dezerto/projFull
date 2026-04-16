'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { equipamentosAPI } from '@/lib/api';
import { AppShell } from '@/components/app-shell';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeftIcon, MonitorIcon } from 'lucide-react';
import Link from 'next/link';

export default function NovoEquipamentoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '',
    categoria: '',
    patrimonio: '',
    status: 'operacional',
    descricao: '',
  });
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      await equipamentosAPI.criar(form);
      toast.success('Equipamento cadastrado com sucesso!');
      router.push('/equipamentos');
    } catch (err) {
      toast.error(err.message || 'Erro ao cadastrar equipamento.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ProtectedRoute niveis={['admin']}>
      <AppShell>
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="shrink-0">
              <Link href="/equipamentos">
                <ArrowLeftIcon className="size-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Novo Equipamento</h2>
              <p className="text-sm text-muted-foreground">Cadastre um novo equipamento no inventário</p>
            </div>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#3078AA]/10">
                  <MonitorIcon className="size-4 text-[#3078AA]" />
                </div>
                <div>
                  <CardTitle className="text-base">Informações do equipamento</CardTitle>
                  <CardDescription className="text-xs">Preencha os dados do novo equipamento</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="nome">Nome <span className="text-destructive">*</span></Label>
                  <Input
                    id="nome"
                    name="nome"
                    placeholder="Ex: Mouse Logitech MX Master 3"
                    value={form.nome}
                    onChange={handleChange}
                    required
                    className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="categoria">Categoria <span className="text-destructive">*</span></Label>
                    <Input
                      id="categoria"
                      name="categoria"
                      placeholder="Ex: Notebook, Projetor, Servidor"
                      value={form.categoria}
                      onChange={handleChange}
                      required
                      className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="patrimonio">Nº Patrimônio <span className="text-destructive">*</span></Label>
                    <Input
                      id="patrimonio"
                      name="patrimonio"
                      placeholder="Ex: MS-001"
                      value={form.patrimonio}
                      onChange={handleChange}
                      required
                      className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Status inicial <span className="text-destructive">*</span></Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v })}
                  >
                    <SelectTrigger className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operacional">Operacional</SelectItem>
                      <SelectItem value="em_manutencao">Em Manutenção</SelectItem>
                      <SelectItem value="desativado">Desativado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    placeholder="Informações adicionais sobre o equipamento..."
                    value={form.descricao}
                    onChange={handleChange}
                    rows={3}
                    className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/equipamentos')}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={carregando}
                    className="flex-1 bg-[#3078AA] hover:bg-[#2567a0] text-white"
                  >
                    {carregando ? 'Cadastrando...' : 'Cadastrar Equipamento'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
