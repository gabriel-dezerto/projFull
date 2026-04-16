'use client';

import { useAuth } from '@/contexts/AuthContext';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon, LogOutIcon, ShieldIcon } from 'lucide-react';

const nivelLabels = {
  admin: 'Administrador',
  tecnico: 'Técnico',
  cliente: 'Cliente',
};

export function NavUser() {
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  const iniciais = usuario.nome
    ? usuario.nome
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer ring-2 ring-[#3078AA]/20 hover:ring-[#3078AA]/50 transition-all">
          <AvatarFallback className="bg-[#3078AA] text-white text-xs font-semibold">
            {iniciais}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 py-2">
          <Avatar className="size-10">
            <AvatarFallback className="bg-[#3078AA] text-white font-semibold">
              {iniciais}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{usuario.nome}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[160px]">
              {usuario.email}
            </span>
            <span className="mt-0.5 text-[10px] text-[#3078AA] font-medium">
              {nivelLabels[usuario.nivel_acesso] || usuario.nivel_acesso}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2">
            <UserIcon className="size-4" />
            <span>Meu perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <ShieldIcon className="size-4" />
            <span>Nível: {nivelLabels[usuario.nivel_acesso]}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            onClick={logout}
          >
            <LogOutIcon className="size-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
