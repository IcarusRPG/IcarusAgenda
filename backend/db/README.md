# Banco de dados (PostgreSQL)

## Arquivos

- `schema/001_initial_schema.sql`: schema inicial completo do MVP multiempresa.
- `migrations/`: pasta sugerida para migrations incrementais futuras.

## Relacionamentos principais

- `companies (1) -> (N) users`
- `companies (1) -> (1) company_settings`
- `companies (1) -> (N) services`
- `companies (1) -> (N) availability`
- `companies (1) -> (N) appointments`
- `services (1) -> (N) appointments` com integridade multi-tenant via FK composta `(company_id, service_id)`.

## Estratégia multi-tenant

- Banco compartilhado, isolamento lógico por `company_id` em todas as tabelas operacionais.
- Índices compostos orientados a filtros por tenant (`company_id`) e agenda (`scheduled_start`, `status`, `service_id`).
- `slug` globalmente único em `companies` para suportar rotas públicas (`/book/:companySlug`).

## Como aplicar localmente

```bash
psql "$DATABASE_URL" -f backend/db/schema/001_initial_schema.sql
```
