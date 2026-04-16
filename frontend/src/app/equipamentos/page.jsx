'use client';

import { useEffect, useState } from 'react';
import { equipamentosAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/app-shell';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
  MonitorIcon,
  PlusIcon,
  AlertCircleIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
} from 'lucide-react';
import Link from 'next/link';

const statusConfig = {
  operacional: { label: 'Operacional', color: 'bg-green-100 text-green-700 border-green-200' },
  em_manutencao: { label: 'Em Manutenção', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  desativado: { label: 'Desativado', color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

function EditarEquipamentoDialog({ equipamento, onSalvo }) {
  const [form, setForm] = useState({
    nome: equipamento.nome || '',
    categoria: equipamento.categoria || '',
    patrimonio: equipamento.patrimonio || '',
    status: equipamento.status || 'operacional',
    descricao: equipamento.descricao || '',
  });
  const [carregando, setCarregando] = useState(false);
  const [aberto, setAberto] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      await equipamentosAPI.atualizar(equipamento.id, form);
      toast.success('Equipamento atualizado com sucesso!');
      setAberto(false);
      onSalvo();
    } catch (err) {
      toast.error(err.message || 'Erro ao atualizar equipamento.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-[#3078AA] hover:text-[#2567a0] hover:bg-blue-50 gap-1.5">
          <PencilIcon className="size-3.5" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Equipamento</DialogTitle>
          <DialogDescription>Atualize as informações do equipamento</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-nome">Nome</Label>
            <Input
              id="edit-nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-categoria">Categoria</Label>
              <Input
                id="edit-categoria"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-patrimonio">Patrimônio</Label>
              <Input
                id="edit-patrimonio"
                value={form.patrimonio}
                onChange={(e) => setForm({ ...form, patrimonio: e.target.value })}
                className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
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
            <Label htmlFor="edit-descricao">Descrição</Label>
            <Textarea
              id="edit-descricao"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={3}
              className="focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA] resize-none"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={carregando} className="bg-[#3078AA] hover:bg-[#2567a0] text-white">
              {carregando ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function EquipamentosPage() {
  const { usuario } = useAuth();
  const [equipamentos, setEquipamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = async () => {
    try {
      const data = await equipamentosAPI.listar();
      setEquipamentos(data);
    } catch (err) {
      setErro(err.message || 'Erro ao carregar equipamentos.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleRemover = async (id, nome) => {
    if (!confirm(`Deseja remover o equipamento "${nome}"?`)) return;
    try {
      await equipamentosAPI.remover(id);
      toast.success('Equipamento removido com sucesso!');
      carregar();
    } catch (err) {
      toast.error(err.message || 'Erro ao remover equipamento.');
    }
  };

  const isAdmin = usuario?.nivel_acesso === 'admin';

  return (
    <ProtectedRoute niveis={['admin', 'tecnico']}>
      <AppShell>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Equipamentos</h2>
              <p className="text-sm text-muted-foreground">
                {carregando ? 'Carregando...' : `${equipamentos.length} equipamento${equipamentos.length !== 1 ? 's' : ''} no inventário`}
              </p>
            </div>
            {isAdmin && (
              <Button asChild className="bg-[#3078AA] hover:bg-[#2567a0] text-white gap-2">
                <Link href="/equipamentos/novo">
                  <PlusIcon className="size-4" />
                  Novo Equipamento
                </Link>
              </Button>
            )}
          </div>

          {carregando ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3 border-b last:border-0">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : erro ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <AlertCircleIcon className="size-10 text-destructive" />
                <p className="font-medium">Erro ao carregar equipamentos</p>
                <p className="text-sm text-muted-foreground">{erro}</p>
              </CardContent>
            </Card>
          ) : equipamentos.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <MonitorIcon className="size-10 text-muted-foreground" />
                <p className="font-medium">Nenhum equipamento cadastrado</p>
                {isAdmin && (
                  <Button asChild className="mt-2 bg-[#3078AA] hover:bg-[#2567a0] text-white gap-2">
                    <Link href="/equipamentos/novo">
                      <PlusIcon className="size-4" />
                      Cadastrar Equipamento
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Patrimônio</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead className="w-32"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipamentos.map((e) => {
                    const status = statusConfig[e.status] || { label: e.status, color: 'bg-slate-100 text-slate-600 border-slate-200' };
                    return (
                      <TableRow key={e.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="text-muted-foreground text-sm">{e.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-foreground">{e.nome}</span>
                            {e.descricao && (
                              <span className="text-xs text-muted-foreground line-clamp-1">{e.descricao}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{e.categoria || '—'}</span>
                        </TableCell>
                        <TableCell>
                          {e.patrimonio ? (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <TagIcon className="size-3" />
                              {e.patrimonio}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <EditarEquipamentoDialog equipamento={e} onSalvo={carregar} />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-red-50 gap-1.5"
                                onClick={() => handleRemover(e.id, e.nome)}
                              >
                                <TrashIcon className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
