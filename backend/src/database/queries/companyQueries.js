export const companyQueries = {
  findBySlug: `
    SELECT id, name, slug, logo_url, status, timezone, created_at, updated_at
    FROM companies
    WHERE slug = $1
    LIMIT 1
  `,
  findById: `
    SELECT id, name, slug, logo_url, status, timezone, created_at, updated_at
    FROM companies
    WHERE id = $1
    LIMIT 1
  `,
};
