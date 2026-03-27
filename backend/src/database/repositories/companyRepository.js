import { dbQuery } from '../client.js';
import { companyQueries } from '../queries/companyQueries.js';

export async function listCompaniesByTenant(tenantCompanyId) {
  const { rows } = await dbQuery(companyQueries.listByTenant, [tenantCompanyId]);
  return rows;
}

export async function findCompanyBySlug(slug) {
  const { rows } = await dbQuery(companyQueries.findBySlug, [slug]);
  return rows[0] || null;
}

export async function findCompanyById(id) {
  const { rows } = await dbQuery(companyQueries.findById, [id]);
  return rows[0] || null;
}

export async function createCompany({ name, slug, timezone, status, logoUrl }) {
  const { rows } = await dbQuery(companyQueries.create, [name, slug, timezone, status, logoUrl]);
  return rows[0];
}

export async function updateCompanyById(id, { name, slug, timezone, status, logoUrl }) {
  const { rows } = await dbQuery(companyQueries.update, [id, name, slug, timezone, status, logoUrl]);
  return rows[0] || null;
}
