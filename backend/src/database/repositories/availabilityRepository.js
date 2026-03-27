import { dbQuery } from '../client.js';
import { availabilityQueries } from '../queries/availabilityQueries.js';

export async function listActiveAvailabilityByCompanyAndDay(companyId, dayOfWeek) {
  const { rows } = await dbQuery(availabilityQueries.listActiveByCompanyAndDay, [companyId, dayOfWeek]);
  return rows;
}
