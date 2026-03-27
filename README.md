# Icarus Agenda — SaaS Multiempresa (Base Inicial)

Estrutura inicial de um SaaS multiempresa com **frontend React + Vite + TailwindCSS** e **backend Node.js + Express**, preparado para crescimento e futuras integrações.

## Visão da arquitetura

- **Monorepo simples** com duas aplicações:
  - `frontend/` → aplicação React (área pública + área autenticada)
  - `backend/` → API Express preparada para multi-tenant
- **Multi-tenant por `company_id`** no backend via middleware de contexto de empresa.
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
    └── src/
        ├── config/             # Configuração de ambiente e constantes
        ├── controllers/        # Controllers HTTP
        ├── middlewares/        # Middlewares (tenant, erros, etc.)
        ├── modules/            # Módulos de domínio (auth, companies, health)
        ├── routes/             # Rotas Express
        ├── services/           # Serviços compartilhados
        ├── utils/              # Helpers/utilitários
        ├── app.js
        └── server.js
```

## Requisitos

- Node.js 20+
- npm 10+

## Executar localmente

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

API padrão: `http://localhost:3333`

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
- `POST /api/auth/login` → endpoint inicial de login (stub)
- `GET /api/companies/:companySlug/public-profile` → perfil público da empresa
- `GET /api/companies/current` → dados da empresa no contexto do tenant (`x-company-id`)

## Constantes globais importantes

Logo padrão Icarus Agenda (frontend e backend):

`https://res.cloudinary.com/dk6okgt0a/image/upload/v1774637295/IcarusAgendaLogo_zhpyop.png`

## Próximos passos sugeridos

- Implementar autenticação real (JWT + refresh token)
- Conectar PostgreSQL (Prisma/Knex/TypeORM)
- Implementar RBAC por empresa
- Implementar modelo de agenda/serviços/profissionais
- Evoluir booking público com disponibilidade real

