import { dbQuery } from '../client.js';
import { serviceQueries } from '../queries/serviceQueries.js';

export async function listActiveServicesByCompanyId(companyId) {
  const { rows } = await dbQuery(serviceQueries.listActiveByCompanyId, [companyId]);
  return rows;
}

export async function findActiveServiceByCompanyAndId(companyId, serviceId) {
  const { rows } = await dbQuery(serviceQueries.findActiveByCompanyAndId, [companyId, serviceId]);
  return rows[0] || null;
}
