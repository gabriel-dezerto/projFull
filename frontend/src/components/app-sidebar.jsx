'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavGroup } from '@/components/nav-group';
import { footerNavLinks, navGroups } from '@/components/app-shared';
import { useAuth } from '@/contexts/AuthContext';

export function AppSidebar() {
  const pathname = usePathname();
  const { usuario } = useAuth();

  // Filtra os grupos de navegação com base no nível de acesso
  const gruposFiltrados = navGroups.map((group) => ({
    ...group,
    items: group.items
      .filter((item) => {
        // Equipamentos: apenas admin
        if (item.path === '/equipamentos' && usuario?.nivel_acesso === 'cliente') return false;
        // Manutenção: apenas admin e técnico
        if (item.path === '/manutencao' && usuario?.nivel_acesso === 'cliente') return false;
        // Dashboard: apenas admin e técnico
        if (item.path === '/dashboard' && usuario?.nivel_acesso === 'cliente') return false;
        return true;
      })
      .map((item) => ({
        ...item,
        isActive: pathname === item.path || pathname.startsWith(item.path + '/'),
        subItems: item.subItems?.map((sub) => ({
          ...sub,
          isActive: pathname === sub.path,
        })),
      })),
  })).filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton asChild>
          <Link href={usuario?.nivel_acesso === 'cliente' ? '/chamados' : '/dashboard'}>
            <Logo className="h-5 text-[#1a5276]" />
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        {gruposFiltrados.map((group, index) => (
          <NavGroup key={`sidebar-group-${index}`} {...group} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {footerNavLinks.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="text-muted-foreground"
                size="sm"
              >
                <a href={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
