export const companyQueries = {
  listByTenant: `
    SELECT id, name, slug, logo_url, status, timezone, created_at, updated_at
    FROM companies
    WHERE id = $1
    ORDER BY created_at DESC
  `,
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
  create: `
    INSERT INTO companies (name, slug, timezone, status, logo_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, slug, logo_url, status, timezone, created_at, updated_at
  `,
  update: `
    UPDATE companies
    SET name = COALESCE($2, name),
        slug = COALESCE($3, slug),
        timezone = COALESCE($4, timezone),
        status = COALESCE($5, status),
        logo_url = COALESCE($6, logo_url),
        updated_at = NOW()
    WHERE id = $1
    RETURNING id, name, slug, logo_url, status, timezone, created_at, updated_at
  `,
};
