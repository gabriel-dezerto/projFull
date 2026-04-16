import {
  LayoutDashboardIcon,
  TicketIcon,
  MonitorIcon,
  WrenchIcon,
  HelpCircleIcon,
  ActivityIcon,
} from 'lucide-react';

export const navGroups = [
  {
    label: 'Principal',
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboardIcon />,
        isActive: false,
      },
    ],
  },
  {
    label: 'Operações',
    items: [
      {
        title: 'Chamados',
        path: '/chamados',
        icon: <TicketIcon />,
        isActive: false,
        subItems: [
          { title: 'Todos os chamados', path: '/chamados' },
          { title: 'Novo chamado', path: '/chamados/novo' },
        ],
      },
      {
        title: 'Equipamentos',
        path: '/equipamentos',
        icon: <MonitorIcon />,
        isActive: false,
        subItems: [
          { title: 'Inventário', path: '/equipamentos' },
          { title: 'Novo equipamento', path: '/equipamentos/novo' },
        ],
      },
      {
        title: 'Manutenção',
        path: '/manutencao',
        icon: <WrenchIcon />,
        isActive: false,
        subItems: [
          { title: 'Histórico', path: '/manutencao' },
          { title: 'Registrar manutenção', path: '/manutencao/nova' },
        ],
      },
    ],
  },
];

export const footerNavLinks = [
  {
    title: 'Ajuda',
    path: '#/ajuda',
    icon: <HelpCircleIcon />,
  },
  {
    title: 'Status do sistema',
    path: '#/status',
    icon: <ActivityIcon />,
  },
];

export const navLinks = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item]
    )
  ),
  ...footerNavLinks,
];
