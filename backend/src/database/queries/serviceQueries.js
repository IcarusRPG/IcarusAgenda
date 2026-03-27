export const serviceQueries = {
  listActiveByCompanyId: `
    SELECT id, company_id, name, description, duration_minutes, status, created_at, updated_at
    FROM services
    WHERE company_id = $1
      AND status = 'active'
    ORDER BY name ASC
  `,
  findActiveByCompanyAndId: `
    SELECT id, company_id, name, description, duration_minutes, status, created_at, updated_at
    FROM services
    WHERE company_id = $1
      AND id = $2
      AND status = 'active'
    LIMIT 1
  `,
};
