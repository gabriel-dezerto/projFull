'use client';

import { useEffect, useState } from 'react';
import { manutencaoAPI } from '@/lib/api';
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
  WrenchIcon,
  PlusIcon,
  AlertCircleIcon,
  MonitorIcon,
  UserIcon,
  ClockIcon,
  TicketIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function ManutencaoPage() {
  const { usuario } = useAuth();
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await manutencaoAPI.listar();
        setRegistros(data);
      } catch (err) {
        setErro(err.message || 'Erro ao carregar histórico de manutenção.');
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  const isTecnico = usuario?.nivel_acesso === 'tecnico';

  return (
    <ProtectedRoute niveis={['admin', 'tecnico']}>
      <AppShell>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Histórico de Manutenção</h2>
              <p className="text-sm text-muted-foreground">
                {carregando ? 'Carregando...' : `${registros.length} registro${registros.length !== 1 ? 's' : ''} encontrado${registros.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            {isTecnico && (
              <Button asChild className="bg-[#3078AA] hover:bg-[#2567a0] text-white gap-2">
                <Link href="/manutencao/nova">
                  <PlusIcon className="size-4" />
                  Registrar Manutenção
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
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : erro ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <AlertCircleIcon className="size-10 text-destructive" />
                <p className="font-medium">Erro ao carregar histórico</p>
                <p className="text-sm text-muted-foreground">{erro}</p>
              </CardContent>
            </Card>
          ) : registros.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <WrenchIcon className="size-10 text-muted-foreground" />
                <p className="font-medium">Nenhuma manutenção registrada</p>
                <p className="text-sm text-muted-foreground">Os registros de manutenção aparecerão aqui</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Chamado</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Técnico</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Registrado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registros.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-muted-foreground text-sm">{r.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground flex items-center gap-1.5">
                            <TicketIcon className="size-3.5 text-muted-foreground" />
                            {r.chamado_titulo}
                          </span>
                          <span className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                            r.chamado_status === 'resolvido'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          }`}>
                            {r.chamado_status === 'resolvido' ? 'Resolvido' : r.chamado_status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MonitorIcon className="size-3.5" />
                          <span>
                            {r.equipamento_nome}
                            {r.equipamento_patrimonio && (
                              <span className="text-xs ml-1">({r.equipamento_patrimonio})</span>
                            )}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <UserIcon className="size-3.5" />
                          {r.tecnico_nome}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-foreground max-w-xs line-clamp-2">{r.descricao}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <ClockIcon className="size-3" />
                          {new Date(r.registrado_em).toLocaleString('pt-BR')}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
