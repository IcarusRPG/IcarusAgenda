import { dbQuery } from '../client.js';
import { companyQueries } from '../queries/companyQueries.js';

export async function findCompanyBySlug(slug) {
  const { rows } = await dbQuery(companyQueries.findBySlug, [slug]);
  return rows[0] || null;
}

export async function findCompanyById(id) {
  const { rows } = await dbQuery(companyQueries.findById, [id]);
  return rows[0] || null;
}
