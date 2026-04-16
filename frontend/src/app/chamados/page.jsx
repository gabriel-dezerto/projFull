'use client';

import { useEffect, useState } from 'react';
import { chamadosAPI } from '@/lib/api';
import { AppShell } from '@/components/app-shell';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  TicketIcon,
  PlusIcon,
  AlertCircleIcon,
  MonitorIcon,
  ClockIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';

const statusConfig = {
  aberto: { label: 'Aberto', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  em_atendimento: { label: 'Em Atendimento', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  resolvido: { label: 'Resolvido', color: 'bg-green-100 text-green-700 border-green-200' },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700 border-red-200' },
};

const prioridadeConfig = {
  alta: { label: 'Alta', variant: 'destructive' },
  media: { label: 'Média', variant: 'secondary' },
  baixa: { label: 'Baixa', variant: 'outline' },
};

export default function ChamadosPage() {
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await chamadosAPI.listar();
        setChamados(data);
      } catch (err) {
        setErro(err.message || 'Erro ao carregar chamados.');
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="flex flex-col gap-6">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Chamados</h2>
              <p className="text-sm text-muted-foreground">
                {carregando ? 'Carregando...' : `${chamados.length} chamado${chamados.length !== 1 ? 's' : ''} encontrado${chamados.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <Button asChild className="bg-[#3078AA] hover:bg-[#2567a0] text-white gap-2">
              <Link href="/chamados/novo">
                <PlusIcon className="size-4" />
                Novo Chamado
              </Link>
            </Button>
          </div>

          {/* Conteúdo */}
          {carregando ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="flex flex-col gap-0">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 border-b last:border-0">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : erro ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <AlertCircleIcon className="size-10 text-destructive" />
                <p className="font-medium">Erro ao carregar chamados</p>
                <p className="text-sm text-muted-foreground">{erro}</p>
              </CardContent>
            </Card>
          ) : chamados.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <TicketIcon className="size-10 text-muted-foreground" />
                <p className="font-medium">Nenhum chamado encontrado</p>
                <p className="text-sm text-muted-foreground">Abra um novo chamado para começar</p>
                <Button asChild className="mt-2 bg-[#3078AA] hover:bg-[#2567a0] text-white gap-2">
                  <Link href="/chamados/novo">
                    <PlusIcon className="size-4" />
                    Novo Chamado
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aberto em</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chamados.map((c) => {
                    const status = statusConfig[c.status] || { label: c.status, color: 'bg-slate-100 text-slate-600 border-slate-200' };
                    const prioridade = prioridadeConfig[c.prioridade] || { label: c.prioridade, variant: 'secondary' };
                    return (
                      <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="text-muted-foreground text-sm">{c.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-foreground">{c.titulo}</span>
                            {c.cliente_nome && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <UserIcon className="size-3" />
                                {c.cliente_nome}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MonitorIcon className="size-3.5" />
                            {c.equipamento_nome}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={prioridade.variant} className="text-xs">
                            {prioridade.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <ClockIcon className="size-3" />
                            {new Date(c.aberto_em).toLocaleDateString('pt-BR')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button asChild variant="ghost" size="sm" className="text-[#3078AA] hover:text-[#2567a0] hover:bg-blue-50">
                            <Link href={`/chamados/${c.id}`}>Ver</Link>
                          </Button>
                        </TableCell>
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
