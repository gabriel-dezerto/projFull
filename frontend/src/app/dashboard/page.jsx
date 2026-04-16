'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI } from '@/lib/api';
import { AppShell } from '@/components/app-shell';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TicketIcon,
  MonitorIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  WrenchIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';

const statusChamadoConfig = {
  aberto: { label: 'Aberto', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: TicketIcon },
  em_atendimento: { label: 'Em Atendimento', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: WrenchIcon },
  resolvido: { label: 'Resolvido', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircleIcon },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircleIcon },
};

const statusEquipConfig = {
  operacional: { label: 'Operacional', color: 'bg-green-100 text-green-700 border-green-200', icon: MonitorIcon },
  em_manutencao: { label: 'Em Manutenção', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: WrenchIcon },
  desativado: { label: 'Desativado', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: XCircleIcon },
};

const prioridadeConfig = {
  alta: { label: 'Alta', variant: 'destructive' },
  media: { label: 'Média', variant: 'secondary' },
  baixa: { label: 'Baixa', variant: 'outline' },
};

function DashboardAdmin({ dados }) {
  const totalChamados = dados.chamados.reduce((acc, c) => acc + Number(c.total), 0);
  const totalEquipamentos = dados.equipamentos.reduce((acc, e) => acc + Number(e.total), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Visão Geral</h2>
        <p className="text-sm text-muted-foreground">Resumo do sistema de chamados e equipamentos</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <TicketIcon className="size-4" />
          Chamados ({totalChamados} total)
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Object.entries(statusChamadoConfig).map(([status, config]) => {
            const item = dados.chamados.find((c) => c.status === status);
            const total = item ? Number(item.total) : 0;
            const Icon = config.icon;
            return (
              <Card key={status} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.color} mb-3`}>
                    <Icon className="size-3" />
                    {config.label}
                  </div>
                  <p className="text-2xl font-bold text-foreground">{total}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <MonitorIcon className="size-4" />
          Equipamentos ({totalEquipamentos} total)
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {Object.entries(statusEquipConfig).map(([status, config]) => {
            const item = dados.equipamentos.find((e) => e.status === status);
            const total = item ? Number(item.total) : 0;
            const Icon = config.icon;
            return (
              <Card key={status} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.color} mb-3`}>
                    <Icon className="size-3" />
                    {config.label}
                  </div>
                  <p className="text-2xl font-bold text-foreground">{total}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardTecnico({ chamados }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Painel do Técnico</h2>
        <p className="text-sm text-muted-foreground">
          {chamados.length} chamado{chamados.length !== 1 ? 's' : ''} aguardando atendimento
        </p>
      </div>

      {chamados.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <CheckCircleIcon className="size-10 text-green-500" />
            <p className="font-medium text-foreground">Nenhum chamado pendente</p>
            <p className="text-sm text-muted-foreground">Todos os chamados foram atendidos!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {chamados.map((c) => (
            <Link key={c.chamado_id || c.id} href={`/chamados/${c.chamado_id || c.id}`}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={prioridadeConfig[c.prioridade]?.variant || 'secondary'} className="text-xs">
                          {prioridadeConfig[c.prioridade]?.label || c.prioridade}
                        </Badge>
                        <span className="text-xs text-muted-foreground">#{c.chamado_id}</span>
                      </div>
                      <p className="font-medium text-foreground truncate">{c.titulo}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MonitorIcon className="size-3" />
                          {c.equipamento || c.equipamento_nome}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserIcon className="size-3" />
                          {c.solicitante || c.cliente_nome}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                        c.status === 'aberto'
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                        {c.status === 'aberto' ? 'Aberto' : 'Em Atendimento'}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <ClockIcon className="size-3" />
                        {new Date(c.aberto_em).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-24 mb-3 rounded-full" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { usuario } = useAuth();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!usuario) return;

    const carregar = async () => {
      try {
        if (usuario.nivel_acesso === 'admin') {
          const data = await dashboardAPI.resumoAdmin();
          setDados({ tipo: 'admin', ...data });
        } else if (usuario.nivel_acesso === 'tecnico') {
          const data = await dashboardAPI.painelTecnico();
          // view_painel_tecnico retorna chamado_id (não id)
          setDados({ tipo: 'tecnico', chamados: Array.isArray(data) ? data : [] });
        }
      } catch (err) {
        setErro(err.message || 'Erro ao carregar dashboard.');
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [usuario]);

  return (
    <ProtectedRoute niveis={['admin', 'tecnico']}>
      <AppShell>
        {carregando ? (
          <DashboardSkeleton />
        ) : erro ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
              <AlertCircleIcon className="size-10 text-destructive" />
              <p className="font-medium text-foreground">Erro ao carregar dashboard</p>
              <p className="text-sm text-muted-foreground">{erro}</p>
            </CardContent>
          </Card>
        ) : dados?.tipo === 'admin' ? (
          <DashboardAdmin dados={dados} />
        ) : dados?.tipo === 'tecnico' ? (
          <DashboardTecnico chamados={dados.chamados} />
        ) : null}
      </AppShell>
    </ProtectedRoute>
  );
}
