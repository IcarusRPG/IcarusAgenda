# Icarus Agenda — SaaS Multiempresa (Base Inicial)

Estrutura inicial de um SaaS multiempresa com **frontend React + Vite + TailwindCSS** e **backend Node.js + Express**, preparado para crescimento e futuras integrações.

## Visão da arquitetura

- **Monorepo simples** com duas aplicações:
  - `frontend/` → aplicação React (área pública + área autenticada)
  - `backend/` → API Express preparada para multi-tenant
- **Multi-tenant por `company_id`** no backend usando JWT + `tenantContext` derivado do token.
- **Login único Icarus Agenda** (identidade visual padrão no login).
- **Ambiente interno por empresa** (layout autenticado preparado para logo própria da empresa).
- **Footer global** sempre com marca Icarus Agenda.
- **Rota pública preparada**: `/book/:companySlug`.
- **Sem integrações externas neste momento** (n8n, Google Calendar, Outlook).

## Estrutura de pastas

```text
.
├── frontend/
│   ├── public/
│   └── src/
│       ├── app/                # Providers e roteamento
│       ├── components/         # Componentes compartilhados (layout/ui/branding)
│       ├── config/             # Constantes globais e variáveis de ambiente
│       ├── features/           # Módulos por domínio (auth, dashboard, booking)
│       ├── hooks/              # Hooks reutilizáveis
│       ├── services/           # Cliente HTTP e acesso à API
│       ├── styles/             # Estilos globais (Tailwind)
│       ├── App.jsx
│       └── main.jsx
└── backend/
    ├── db/
    │   ├── schema/             # SQL de criação inicial do banco
    │   └── migrations/         # Migrations incrementais futuras
    └── src/
        ├── config/             # Configuração de ambiente e constantes
        ├── controllers/        # Controllers HTTP
        ├── database/           # Cliente PostgreSQL, queries e repositories
        ├── middlewares/        # Middlewares (auth, tenant, erros)
        ├── modules/            # Módulos de domínio
        ├── routes/             # Rotas Express
        ├── utils/              # JWT e criptografia
        ├── app.js
        └── server.js
```

## Modelo de dados (PostgreSQL)

Schema inicial em: `backend/db/schema/001_initial_schema.sql`

Entidades do MVP:

- `companies`
- `users`
- `company_settings`
- `services`
- `availability`
- `appointments`

### Relacionamentos

- `companies (1) -> (N) users`
- `companies (1) -> (1) company_settings`
- `companies (1) -> (N) services`
- `companies (1) -> (N) availability`
- `companies (1) -> (N) appointments`
- `services (1) -> (N) appointments` com integridade tenant-safe via FK composta (`company_id`, `service_id`)

## Autenticação (email/senha + JWT)

### Fluxo

1. Frontend envia `POST /api/auth/login` com `email` e `password`.
2. Backend consulta `users`, valida `password_hash` com **bcrypt**.
3. Backend gera JWT com payload:
   - `userId`
   - `companyId`
   - `role`
4. Backend retorna:
   - `user_id`
   - `company_id`
   - `name`
   - `role`
   - `token`
5. Frontend salva token no `localStorage` e envia `Authorization: Bearer <token>` em toda chamada autenticada.
6. Middleware `requireAuth` valida JWT e `tenantContext` extrai `company_id` do token.

### Exemplo de payload JWT

```json
{
  "userId": "4f6f66fc-3708-4c71-8f6c-cbd14e9e0ab9",
  "companyId": "479319fb-7a4f-4c3b-acaf-6c675f76c1f7",
  "role": "admin",
  "iat": 1711546800,
  "exp": 1711575600
}
```

## Requisitos

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## Executar localmente

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

API padrão: `http://localhost:3333`

Aplicar schema SQL no PostgreSQL:

```bash
npm run db:schema
```

### Variáveis de ambiente do backend

```env
NODE_ENV=development
PORT=3333
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/icarus_agenda
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=8h
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

App padrão: `http://localhost:5173`

## Rotas iniciais

### Frontend

- `/login` → login único com identidade Icarus Agenda
- `/app` → área autenticada (dashboard)
- `/book/:companySlug` → página pública de agendamento por empresa (estrutura inicial)

### Backend

- `GET /api/health` → saúde da API
- `POST /api/auth/login` → login real com JWT
- `GET /api/companies` → lista empresas no escopo do tenant autenticado
- `POST /api/companies` → cria empresa (admin/owner)
- `GET /api/companies/:id` → busca empresa por ID (com isolamento por tenant)
- `PATCH /api/companies/:id` → atualiza empresa (com isolamento por tenant)
- `GET /api/companies/slug/:slug` → busca empresa por slug
- `GET /api/companies/:companySlug/public-profile` → perfil público da empresa
- `GET /api/companies/current` → dados da empresa autenticada via JWT

## Constantes globais importantes

Logo padrão Icarus Agenda (frontend e backend):

`https://res.cloudinary.com/dk6okgt0a/image/upload/v1774637295/IcarusAgendaLogo_zhpyop.png`
