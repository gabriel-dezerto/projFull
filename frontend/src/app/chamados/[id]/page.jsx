'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { chamadosAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/app-shell';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  ArrowLeftIcon,
  MonitorIcon,
  UserIcon,
  ClockIcon,
  AlertCircleIcon,
  WrenchIcon,
  CheckCircleIcon,
  XCircleIcon,
  TicketIcon,
} from 'lucide-react';
import Link from 'next/link';

const statusConfig = {
  aberto: { label: 'Aberto', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: TicketIcon },
  em_atendimento: { label: 'Em Atendimento', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: WrenchIcon },
  resolvido: { label: 'Resolvido', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircleIcon },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircleIcon },
};

const prioridadeConfig = {
  alta: { label: 'Alta', variant: 'destructive' },
  media: { label: 'Média', variant: 'secondary' },
  baixa: { label: 'Baixa', variant: 'outline' },
};

// Transições permitidas por status
const transicoesPermitidas = {
  aberto: ['em_atendimento', 'cancelado'],
  em_atendimento: ['resolvido', 'cancelado'],
  resolvido: [],
  cancelado: [],
};

const transicaoLabels = {
  em_atendimento: 'Iniciar Atendimento',
  resolvido: 'Marcar como Resolvido',
  cancelado: 'Cancelar Chamado',
};

export default function DetalhesChamadoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { usuario } = useAuth();
  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  const [novoStatus, setNovoStatus] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await chamadosAPI.buscarPorId(id);
        setChamado(data);
      } catch (err) {
        setErro(err.message || 'Erro ao carregar chamado.');
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [id]);

  const handleAtualizarStatus = async () => {
    if (!novoStatus) {
      toast.error('Selecione um novo status.');
      return;
    }

    setAtualizando(true);
    try {
      const body = { status: novoStatus };
      if (novoStatus === 'em_atendimento' && usuario?.nivel_acesso === 'tecnico') {
        body.tecnico_id = usuario.id;
      }
      await chamadosAPI.atualizarStatus(id, body);
      toast.success(`Status atualizado para "${statusConfig[novoStatus]?.label || novoStatus}"`);
      // Recarrega os dados
      const data = await chamadosAPI.buscarPorId(id);
      setChamado(data);
      setNovoStatus('');
    } catch (err) {
      toast.error(err.message || 'Erro ao atualizar status.');
    } finally {
      setAtualizando(false);
    }
  };

  const podeAtualizarStatus =
    chamado &&
    (usuario?.nivel_acesso === 'admin' || usuario?.nivel_acesso === 'tecnico') &&
    transicoesPermitidas[chamado.status]?.length > 0;

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="flex flex-col gap-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="shrink-0">
              <Link href="/chamados">
                <ArrowLeftIcon className="size-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Detalhes do Chamado</h2>
              <p className="text-sm text-muted-foreground">#{id}</p>
            </div>
          </div>

          {carregando ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex flex-col gap-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              </CardContent>
            </Card>
          ) : erro ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <AlertCircleIcon className="size-10 text-destructive" />
                <p className="font-medium">Erro ao carregar chamado</p>
                <p className="text-sm text-muted-foreground">{erro}</p>
              </CardContent>
            </Card>
          ) : chamado ? (
            <>
              {/* Card principal */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={prioridadeConfig[chamado.prioridade]?.variant || 'secondary'}>
                          {prioridadeConfig[chamado.prioridade]?.label || chamado.prioridade}
                        </Badge>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig[chamado.status]?.color || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {statusConfig[chamado.status]?.label || chamado.status}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{chamado.titulo}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  {/* Descrição */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Descrição</p>
                    <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-lg p-3">
                      {chamado.descricao || 'Sem descrição informada.'}
                    </p>
                  </div>

                  {/* Informações */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Equipamento</p>
                      <p className="text-sm text-foreground flex items-center gap-1.5">
                        <MonitorIcon className="size-4 text-muted-foreground" />
                        {chamado.equipamento_nome}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Solicitante</p>
                      <p className="text-sm text-foreground flex items-center gap-1.5">
                        <UserIcon className="size-4 text-muted-foreground" />
                        {chamado.cliente_nome}
                      </p>
                    </div>

                    {chamado.tecnico_nome && (
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Técnico Responsável</p>
                        <p className="text-sm text-foreground flex items-center gap-1.5">
                          <WrenchIcon className="size-4 text-muted-foreground" />
                          {chamado.tecnico_nome}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Aberto em</p>
                      <p className="text-sm text-foreground flex items-center gap-1.5">
                        <ClockIcon className="size-4 text-muted-foreground" />
                        {new Date(chamado.aberto_em).toLocaleString('pt-BR')}
                      </p>
                    </div>

                    {chamado.atualizado_em && chamado.atualizado_em !== chamado.aberto_em && (
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Última atualização</p>
                        <p className="text-sm text-foreground flex items-center gap-1.5">
                          <ClockIcon className="size-4 text-muted-foreground" />
                          {new Date(chamado.atualizado_em).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card de atualização de status (apenas admin/técnico) */}
              {podeAtualizarStatus && (
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Atualizar Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Select value={novoStatus} onValueChange={setNovoStatus}>
                        <SelectTrigger className="flex-1 focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]">
                          <SelectValue placeholder="Selecione o novo status" />
                        </SelectTrigger>
                        <SelectContent>
                          {transicoesPermitidas[chamado.status]?.map((s) => (
                            <SelectItem key={s} value={s}>
                              {transicaoLabels[s] || s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAtualizarStatus}
                        disabled={!novoStatus || atualizando}
                        className="bg-[#3078AA] hover:bg-[#2567a0] text-white shrink-0"
                      >
                        {atualizando ? 'Atualizando...' : 'Confirmar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ação de registrar manutenção (técnico) */}
              {usuario?.nivel_acesso === 'tecnico' && chamado.status === 'em_atendimento' && (
                <Card className="border-0 shadow-sm border-l-4 border-l-[#3078AA]">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">Registrar manutenção</p>
                      <p className="text-sm text-muted-foreground">Documente o que foi feito neste chamado</p>
                    </div>
                    <Button asChild className="bg-[#3078AA] hover:bg-[#2567a0] text-white shrink-0">
                      <Link href={`/manutencao/nova?chamado_id=${id}&equipamento_id=${chamado.equipamento_id || ''}`}>
                        <WrenchIcon className="size-4 mr-2" />
                        Registrar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
