import { dbQuery } from '../client.js';
import { appointmentQueries } from '../queries/appointmentQueries.js';

export async function listAppointmentsByCompanyAndRange({ companyId, rangeStart, rangeEnd }) {
  const { rows } = await dbQuery(appointmentQueries.listByCompanyAndRange, [companyId, rangeStart, rangeEnd]);
  return rows;
}

export async function listOverlappingAppointmentsByCompany({ companyId, rangeStart, rangeEnd }) {
  const { rows } = await dbQuery(appointmentQueries.listOverlappingByCompany, [companyId, rangeStart, rangeEnd]);
  return rows;
}

export async function createPublicAppointment({
  companyId,
  serviceId,
  customerName,
  customerEmail,
  scheduledStart,
  scheduledEnd,
  notes,
}) {
  const { rows } = await dbQuery(appointmentQueries.createPublic, [
    companyId,
    serviceId,
    customerName,
    customerEmail,
    scheduledStart,
    scheduledEnd,
    notes || null,
  ]);

  return rows[0];
}
