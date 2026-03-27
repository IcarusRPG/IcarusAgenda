import { dbQuery } from '../client.js';
import { appointmentQueries } from '../queries/appointmentQueries.js';

export async function listAppointmentsByCompanyAndRange({ companyId, rangeStart, rangeEnd }) {
  const { rows } = await dbQuery(appointmentQueries.listByCompanyAndRange, [companyId, rangeStart, rangeEnd]);
  return rows;
}
