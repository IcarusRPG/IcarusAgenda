export const userQueries = {
  findActiveByEmail: `
    SELECT u.id, u.company_id, u.name, u.email, u.password_hash, u.role, u.status,
           c.name AS company_name, c.slug AS company_slug, c.logo_url AS company_logo_url,
           c.status AS company_status, c.timezone AS company_timezone
    FROM users u
    INNER JOIN companies c ON c.id = u.company_id
    WHERE u.email = $1
      AND u.status = 'active'
      AND c.status = 'active'
    LIMIT 1
  `,
};
