# TechRent - Sistema de Chamados de TI

Um sistema completo de gerenciamento de chamados e manutenção de equipamentos de TI, construído com **Next.js 16**, **Shadcn/UI**, **Tailwind CSS**, **Express.js** e **MySQL**.

## 🚀 Quick Start

```bash
# 1. Setup do banco de dados
mysql -u root -p < bd/schema.sql
mysql -u root -p < bd/views.sql

# 2. Backend
cd backend
cp .env.example .env
# Edite .env com suas credenciais MySQL
npm install
npm start

# 3. Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:3000` e faça login!

**Para instruções detalhadas**, veja [SETUP.md](./SETUP.md)

---

## 📋 Funcionalidades

### Para Clientes
- ✅ Abrir novos chamados
- ✅ Listar seus chamados
- ✅ Acompanhar status em tempo real

### Para Técnicos
- ✅ Dashboard com chamados pendentes
- ✅ Iniciar atendimento
- ✅ Registrar manutenção realizada
- ✅ Histórico de reparos

### Para Administradores
- ✅ Dashboard com resumo de chamados e equipamentos
- ✅ Gerenciar inventário de equipamentos
- ✅ Visualizar histórico de manutenção
- ✅ Controle de acesso por nível

---

## 🏗️ Arquitetura

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI**: Shadcn/UI + Tailwind CSS
- **Estado**: React Context (AuthContext)
- **Autenticação**: JWT com localStorage
- **HTTP**: Fetch API com interceptor de token

### Backend
- **Framework**: Express.js
- **Autenticação**: JWT + bcryptjs
- **Banco de Dados**: MySQL 8.0+
- **CORS**: Habilitado para localhost:3000

### Banco de Dados
- **Tabelas**: `usuarios`, `equipamentos`, `chamados`, `historico_manutencao`
- **Views**: `view_painel_tecnico`, `view_resumo_chamados`, `view_resumo_equipamentos`

---

## 📁 Estrutura do Projeto

```
projFull/
├── backend/
│   ├── controllers/      # Lógica de negócio
│   ├── routes/           # Endpoints da API
│   ├── middlewares/      # Autenticação JWT
│   ├── config/           # Conexão MySQL
│   ├── server.js         # Entrada
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/          # Páginas (Next.js)
│   │   ├── components/   # Componentes React
│   │   ├── contexts/     # AuthContext
│   │   ├── lib/          # API client, utils
│   │   └── app/globals.css
│   ├── package.json
│   └── .env.local
├── bd/
│   ├── schema.sql        # Tabelas
│   └── views.sql         # Views
├── README.md
└── SETUP.md              # Guia detalhado
```

---

## 🔐 Fluxo de Autenticação

1. **Registro**: Usuário cria conta com email, senha (bcrypt) e nível de acesso
2. **Login**: Backend retorna JWT com payload `{ id, nome, email, nivel_acesso }`
3. **Frontend**: Decodifica JWT, armazena em localStorage e redireciona conforme nível
4. **Requisições**: Token enviado no header `Authorization: Bearer <token>`
5. **Logout**: Remove token do localStorage e redireciona para login

---

## 📊 Fluxo de Chamados

```
Cliente abre chamado
    ↓
Equipamento muda status para "em_manutencao"
    ↓
Técnico vê chamado no dashboard
    ↓
Técnico inicia atendimento (status → "em_atendimento")
    ↓
Técnico registra manutenção
    ↓
Chamado marcado como "resolvido"
Equipamento volta para "operacional"
```

---

## 🎨 Design

- **Cores TechRent**: Azul primário `#3078AA`, fundo claro `#DFF2F9`
- **Componentes**: Shadcn/UI (Button, Card, Dialog, Select, etc.)
- **Responsivo**: Tailwind CSS com breakpoints mobile-first
- **Ícones**: Lucide React

---

## 🔌 Endpoints da API

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/registro` - Registro

### Chamados
- `GET /chamados` - Listar (filtrado por nível)
- `GET /chamados/:id` - Detalhes
- `POST /chamados` - Criar (cliente/admin)
- `PUT /chamados/:id/status` - Atualizar status (técnico/admin)

### Equipamentos
- `GET /equipamentos` - Listar
- `GET /equipamentos/:id` - Detalhes
- `POST /equipamentos` - Criar (admin)
- `PUT /equipamentos/:id` - Editar (admin)
- `DELETE /equipamentos/:id` - Remover (admin)

### Manutenção
- `GET /manutencao` - Histórico (técnico/admin)
- `POST /manutencao` - Registrar (técnico)

### Dashboard
- `GET /dashboard/admin` - Resumo (admin)
- `GET /dashboard/tecnico` - Painel técnico (técnico/admin)

---

## 🛠️ Desenvolvimento

### Adicionar um novo componente Shadcn

```bash
cd frontend
npx shadcn-ui@latest add <component-name>
```

### Estrutura de uma página

```jsx
'use client';
import { AppShell } from '@/components/app-shell';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute niveis={['admin']}>
      <AppShell>
        {/* Seu conteúdo aqui */}
      </AppShell>
    </ProtectedRoute>
  );
}
```

---

## 📦 Dependências Principais

### Frontend
- `next@16.2.4` - Framework React
- `react@19.2.4` - React
- `tailwindcss@4.2.2` - Styling
- `shadcn@4.1.2` - Componentes UI
- `sonner@2.0.7` - Toasts
- `lucide-react@1.7.0` - Ícones

### Backend
- `express@4.18.2` - Framework web
- `mysql2@3.9.7` - Driver MySQL
- `jsonwebtoken@9.0.2` - JWT
- `bcryptjs@2.4.3` - Hash de senhas
- `cors@2.8.6` - CORS
- `dotenv@16.4.5` - Variáveis de ambiente

---

## 🐛 Troubleshooting

**Erro: "Module not found: Can't resolve 'sonner'"**
```bash
cd frontend
npm install
npm run dev
```

**Erro: "Can't connect to MySQL"**
- Verifique se MySQL está rodando
- Confirme credenciais em `backend/.env`
- Verifique se o banco foi criado: `mysql -u root -p -e "SHOW DATABASES;"`

**Erro: "JWT_SECRET is not defined"**
- Copie `backend/.env.example` para `backend/.env`
- Preencha as credenciais

---

## 📝 Licença

Este projeto é fornecido como está para fins educacionais.

---

## 👤 Autor

Desenvolvido como sistema de gerenciamento de chamados de TI.

---

## 🤝 Contribuindo

Sinta-se livre para abrir issues e pull requests!

---

## 📞 Suporte

Para dúvidas ou problemas, consulte [SETUP.md](./SETUP.md) ou abra uma issue no repositório.
