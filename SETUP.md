# TechRent - Guia de Setup e Execução

## Pré-requisitos

- **Node.js** 18+ e **npm** 9+
- **MySQL** 8.0+
- **Git**

## 1. Setup do Banco de Dados

### 1.1 Criar o banco e as tabelas

```bash
mysql -u root -p < bd/schema.sql
```

Quando solicitado, digite sua senha do MySQL.

### 1.2 Criar as views

```bash
mysql -u root -p < bd/views.sql
```

### 1.3 Verificar a criação

```bash
mysql -u root -p
USE techrent_db;
SHOW TABLES;
SHOW VIEWS;
```

Você deve ver as tabelas: `usuarios`, `equipamentos`, `chamados`, `historico_manutencao`
E as views: `view_equipamentos_operacionais`, `view_painel_tecnico`, `view_resumo_chamados`, `view_resumo_equipamentos`

## 2. Setup do Backend

### 2.1 Instalar dependências

```bash
cd backend
npm install
```

### 2.2 Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do MySQL:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=techrent_db
JWT_SECRET=techrent_jwt_secret_key_change_in_production
```

### 2.3 Iniciar o servidor

```bash
npm start
```

Ou para desenvolvimento com hot-reload:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

## 3. Setup do Frontend

### 3.1 Instalar dependências

```bash
cd frontend
npm install
```

**Importante**: Este passo é essencial! Se você clonou o repositório, a pasta `node_modules` não está incluída. O npm install baixará todas as dependências necessárias, incluindo `sonner`, `@radix-ui/*`, etc.

### 3.2 Variáveis de ambiente

O arquivo `.env.local` já está configurado com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Se você está rodando o backend em outra porta, atualize este arquivo.

### 3.3 Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

## 4. Acessar a aplicação

1. Abra o navegador em `http://localhost:3000`
2. Você será redirecionado para `/login`
3. Crie uma conta em `/registro` ou use credenciais de teste (se criadas no banco)

## 5. Usuários de teste (opcional)

Se quiser criar usuários de teste rapidamente:

```sql
USE techrent_db;

-- Cliente
INSERT INTO usuarios (nome, email, senha, nivel_acesso) 
VALUES ('João Cliente', 'cliente@test.com', '$2a$10$...', 'cliente');

-- Técnico
INSERT INTO usuarios (nome, email, senha, nivel_acesso) 
VALUES ('Maria Técnica', 'tecnico@test.com', '$2a$10$...', 'tecnico');

-- Admin
INSERT INTO usuarios (nome, email, senha, nivel_acesso) 
VALUES ('Admin Sistema', 'admin@test.com', '$2a$10$...', 'admin');
```

**Nota**: As senhas devem ser hashes bcrypt. Use a interface de registro para criar usuários com segurança.

## 6. Estrutura do projeto

```
projFull/
├── backend/
│   ├── controllers/     # Lógica de negócio
│   ├── routes/          # Definição das rotas
│   ├── middlewares/     # JWT, autenticação
│   ├── config/          # Conexão com banco
│   ├── server.js        # Entrada do servidor
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/         # Páginas (Next.js App Router)
│   │   ├── components/  # Componentes React
│   │   ├── contexts/    # Context API (AuthContext)
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilitários (api.js, utils.js)
│   │   └── app/globals.css
│   ├── package.json
│   └── .env.local
├── bd/
│   ├── schema.sql       # Tabelas
│   └── views.sql        # Views
├── README.md
└── SETUP.md
```

## 7. Troubleshooting

### Erro: "Module not found: Can't resolve 'sonner'"

**Solução**: Execute `npm install` na pasta `frontend/`. As dependências não foram baixadas.

```bash
cd frontend
npm install
npm run dev
```

### Erro: "Can't connect to MySQL server"

**Solução**: Verifique se:
1. MySQL está rodando: `sudo service mysql status` (Linux) ou verifique Services (Windows)
2. As credenciais em `.env` estão corretas
3. O banco foi criado: `mysql -u root -p -e "SHOW DATABASES;" | grep techrent_db`

### Erro: "JWT_SECRET is not defined"

**Solução**: Verifique se o arquivo `.env` existe na pasta `backend/` e contém `JWT_SECRET`.

### Frontend não conecta ao backend

**Solução**: Verifique se:
1. Backend está rodando em `http://localhost:3001`
2. `.env.local` do frontend tem `NEXT_PUBLIC_API_URL=http://localhost:3001`
3. CORS está habilitado no backend (já está configurado em `server.js`)

## 8. Fluxo de uso

### Cliente
1. Faz login
2. Vê a lista de chamados que abriu
3. Pode abrir um novo chamado selecionando um equipamento

### Técnico
1. Faz login
2. Vê o dashboard com chamados em aberto/atendimento
3. Clica em um chamado para ver detalhes
4. Pode iniciar atendimento e depois registrar a manutenção
5. Ao registrar manutenção, o chamado é automaticamente marcado como resolvido

### Admin
1. Faz login
2. Vê o dashboard com resumo de chamados e equipamentos
3. Pode gerenciar equipamentos (criar, editar, remover)
4. Pode visualizar o histórico de manutenção

## 9. Recursos adicionais

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [MySQL Documentation](https://dev.mysql.com/doc/)
