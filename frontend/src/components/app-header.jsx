'use client';

import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { NavUser } from '@/components/nav-user';

const rotaLabels = {
  '/dashboard': 'Dashboard',
  '/chamados': 'Chamados',
  '/chamados/novo': 'Novo Chamado',
  '/equipamentos': 'Equipamentos',
  '/equipamentos/novo': 'Novo Equipamento',
  '/manutencao': 'Manutenção',
  '/manutencao/nova': 'Nova Manutenção',
};

function getBreadcrumbs(pathname) {
  const crumbs = [];

  // Chamados com ID dinâmico
  if (pathname.match(/^\/chamados\/\d+$/)) {
    crumbs.push({ label: 'Chamados', href: '/chamados' });
    crumbs.push({ label: 'Detalhes do Chamado', href: null });
    return crumbs;
  }

  const label = rotaLabels[pathname];
  if (!label) {
    crumbs.push({ label: 'TechRent', href: null });
    return crumbs;
  }

  const partes = pathname.split('/').filter(Boolean);
  if (partes.length > 1) {
    const parentPath = '/' + partes[0];
    const parentLabel = rotaLabels[parentPath];
    if (parentLabel) {
      crumbs.push({ label: parentLabel, href: parentPath });
    }
  }

  crumbs.push({ label, href: null });
  return crumbs;
}

export function AppHeader() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 mb-4">
      <div className="flex flex-1 items-center gap-2 px-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1.5">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2 px-4">
        <NavUser />
      </div>
    </header>
  );
}
