'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { chamadosAPI, equipamentosAPI } from '@/lib/api';
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
import { ArrowLeftIcon, TicketIcon } from 'lucide-react';
import Link from 'next/link';

export default function NovoChamadoPage() {
  const router = useRouter();
  const [equipamentos, setEquipamentos] = useState([]);
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    equipamento_id: '',
    prioridade: 'media',
  });
  const [carregando, setCarregando] = useState(false);
  const [carregandoEquip, setCarregandoEquip] = useState(true);

  useEffect(() => {
    const carregarEquipamentos = async () => {
      try {
        const data = await equipamentosAPI.listar();
        // Filtra apenas equipamentos operacionais
        setEquipamentos(data.filter((e) => e.status === 'operacional'));
      } catch (err) {
        toast.error('Erro ao carregar equipamentos.');
      } finally {
        setCarregandoEquip(false);
      }
    };
    carregarEquipamentos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.equipamento_id) {
      toast.error('Selecione um equipamento.');
      return;
    }

    setCarregando(true);
    try {
      const data = await chamadosAPI.criar({
        ...form,
        equipamento_id: Number(form.equipamento_id),
      });
      toast.success('Chamado aberto com sucesso!');
      router.push(`/chamados/${data.id}`);
    } catch (err) {
      toast.error(err.message || 'Erro ao abrir chamado.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ProtectedRoute niveis={['cliente', 'admin']}>
      <AppShell>
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="shrink-0">
              <Link href="/chamados">
                <ArrowLeftIcon className="size-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Novo Chamado</h2>
              <p className="text-sm text-muted-foreground">Relate um problema com um equipamento</p>
            </div>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#3078AA]/10">
                  <TicketIcon className="size-4 text-[#3078AA]" />
                </div>
                <div>
                  <CardTitle className="text-base">Detalhes do chamado</CardTitle>
                  <CardDescription className="text-xs">Preencha todas as informações abaixo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="titulo">Título <span className="text-destructive">*</span></Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    placeholder="Ex: Notebook não liga"
                    value={form.titulo}
                    onChange={handleChange}
                    required
                    className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="descricao">Descrição <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    placeholder="Descreva o problema em detalhes..."
                    value={form.descricao}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label>Equipamento <span className="text-destructive">*</span></Label>
                    <Select
                      value={form.equipamento_id}
                      onValueChange={(v) => setForm({ ...form, equipamento_id: v })}
                      disabled={carregandoEquip}
                    >
                      <SelectTrigger className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]">
                        <SelectValue placeholder={carregandoEquip ? 'Carregando...' : 'Selecione o equipamento'} />
                      </SelectTrigger>
                      <SelectContent>
                        {equipamentos.length === 0 ? (
                          <SelectItem value="none" disabled>Nenhum equipamento disponível</SelectItem>
                        ) : (
                          equipamentos.map((e) => (
                            <SelectItem key={e.id} value={String(e.id)}>
                              {e.nome} {e.patrimonio ? `(${e.patrimonio})` : ''}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label>Prioridade <span className="text-destructive">*</span></Label>
                    <Select
                      value={form.prioridade}
                      onValueChange={(v) => setForm({ ...form, prioridade: v })}
                    >
                      <SelectTrigger className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/chamados')}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={carregando}
                    className="flex-1 bg-[#3078AA] hover:bg-[#2567a0] text-white"
                  >
                    {carregando ? 'Abrindo chamado...' : 'Abrir Chamado'}
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
