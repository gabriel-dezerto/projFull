'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { manutencaoAPI, chamadosAPI } from '@/lib/api';
import { AppShell } from '@/components/app-shell';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { ArrowLeftIcon, WrenchIcon, TicketIcon, MonitorIcon } from 'lucide-react';
import Link from 'next/link';

function NovaManutencaoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chamadoIdParam = searchParams.get('chamado_id');
  const equipamentoIdParam = searchParams.get('equipamento_id');

  const [chamados, setChamados] = useState([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [form, setForm] = useState({
    chamado_id: chamadoIdParam || '',
    equipamento_id: equipamentoIdParam || '',
    descricao: '',
  });
  const [carregando, setCarregando] = useState(false);
  const [carregandoChamados, setCarregandoChamados] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await chamadosAPI.listar();
        const emAtendimento = data.filter((c) => c.status === 'em_atendimento');
        setChamados(emAtendimento);

        if (chamadoIdParam) {
          const chamado = await chamadosAPI.buscarPorId(chamadoIdParam);
          if (chamado) {
            setChamadoSelecionado(chamado);
            setForm((prev) => ({
              ...prev,
              chamado_id: chamadoIdParam,
              equipamento_id: String(chamado.equipamento_id || ''),
            }));
          }
        }
      } catch (err) {
        toast.error('Erro ao carregar chamados.');
      } finally {
        setCarregandoChamados(false);
      }
    };
    carregar();
  }, [chamadoIdParam]);

  const handleChamadoChange = async (value) => {
    setForm({ ...form, chamado_id: value, equipamento_id: '' });
    try {
      const chamado = await chamadosAPI.buscarPorId(value);
      setChamadoSelecionado(chamado);
      setForm((prev) => ({
        ...prev,
        chamado_id: value,
        equipamento_id: String(chamado.equipamento_id || ''),
      }));
    } catch {
      setChamadoSelecionado(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.chamado_id || !form.equipamento_id) {
      toast.error('Selecione um chamado.');
      return;
    }
    if (!form.descricao.trim()) {
      toast.error('Descreva o que foi feito.');
      return;
    }

    setCarregando(true);
    try {
      await manutencaoAPI.criar({
        chamado_id: Number(form.chamado_id),
        equipamento_id: Number(form.equipamento_id),
        descricao: form.descricao,
      });
      toast.success('Manutenção registrada com sucesso! Chamado marcado como resolvido.');
      router.push('/manutencao');
    } catch (err) {
      toast.error(err.message || 'Erro ao registrar manutenção.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/manutencao">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Registrar Manutenção</h2>
          <p className="text-sm text-muted-foreground">Documente o reparo realizado</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#3078AA]/10">
              <WrenchIcon className="size-4 text-[#3078AA]" />
            </div>
            <div>
              <CardTitle className="text-base">Detalhes da manutenção</CardTitle>
              <CardDescription className="text-xs">
                Após registrar, o chamado será marcado como resolvido automaticamente
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label>Chamado em atendimento <span className="text-destructive">*</span></Label>
              <Select
                value={form.chamado_id}
                onValueChange={handleChamadoChange}
                disabled={carregandoChamados || !!chamadoIdParam}
              >
                <SelectTrigger className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]">
                  <SelectValue placeholder={carregandoChamados ? 'Carregando...' : 'Selecione o chamado'} />
                </SelectTrigger>
                <SelectContent>
                  {chamados.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Nenhum chamado em atendimento
                    </SelectItem>
                  ) : (
                    chamados.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        #{c.id} — {c.titulo}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {chamadoSelecionado && (
              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 flex flex-col gap-2">
                <p className="text-xs font-medium text-[#3078AA] uppercase tracking-wide">Chamado selecionado</p>
                <div className="flex items-start gap-2">
                  <TicketIcon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{chamadoSelecionado.titulo}</p>
                    {chamadoSelecionado.descricao && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{chamadoSelecionado.descricao}</p>
                    )}
                  </div>
                </div>
                {chamadoSelecionado.equipamento_nome && (
                  <div className="flex items-center gap-2">
                    <MonitorIcon className="size-4 text-muted-foreground shrink-0" />
                    <p className="text-sm text-muted-foreground">{chamadoSelecionado.equipamento_nome}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descricao">O que foi feito <span className="text-destructive">*</span></Label>
              <Textarea
                id="descricao"
                placeholder="Descreva detalhadamente o reparo realizado, peças trocadas, configurações feitas, etc..."
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                required
                rows={5}
                className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA] resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/manutencao')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={carregando || !form.chamado_id}
                className="flex-1 bg-[#3078AA] hover:bg-[#2567a0] text-white"
              >
                {carregando ? 'Registrando...' : 'Registrar Manutenção'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NovaManutencaoPage() {
  return (
    <ProtectedRoute niveis={['tecnico']}>
      <AppShell>
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3078AA] border-t-transparent" />
          </div>
        }>
          <NovaManutencaoForm />
        </Suspense>
      </AppShell>
    </ProtectedRoute>
  );
}
