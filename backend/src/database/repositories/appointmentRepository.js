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

export async function listOverlappingAppointmentsByCompanyExcludingId({ companyId, appointmentId, rangeStart, rangeEnd }) {
  const { rows } = await dbQuery(appointmentQueries.listOverlappingByCompanyExcludingId, [
    companyId,
    appointmentId,
    rangeStart,
    rangeEnd,
  ]);
  return rows;
}

export async function findAppointmentByIdAndCompany({ companyId, appointmentId }) {
  const { rows } = await dbQuery(appointmentQueries.findByIdAndCompany, [companyId, appointmentId]);
  return rows[0] || null;
}

export async function updateAppointmentStatusByIdAndCompany({ companyId, appointmentId, status }) {
  const { rows } = await dbQuery(appointmentQueries.updateStatusByIdAndCompany, [companyId, appointmentId, status]);
  return rows[0] || null;
}

export async function updateAppointmentByIdAndCompany({
  companyId,
  appointmentId,
  serviceId,
  customerName,
  customerEmail,
  scheduledStart,
  scheduledEnd,
  notes,
}) {
  const { rows } = await dbQuery(appointmentQueries.updateByIdAndCompany, [
    companyId,
    appointmentId,
    serviceId,
    customerName,
    customerEmail,
    scheduledStart,
    scheduledEnd,
    notes || null,
  ]);

  return rows[0] || null;
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
  const { rows } = await dbQuery(appointmentQueries.createPublicSafe, [
    companyId,
    serviceId,
    customerName,
    customerEmail,
    scheduledStart,
    scheduledEnd,
    notes || null,
  ]);

  return rows[0] || null;
}
