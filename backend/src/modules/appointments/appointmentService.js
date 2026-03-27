import {
  createPublicAppointment,
  listAppointmentsByCompanyAndRange,
  listOverlappingAppointmentsByCompany,
} from '../../database/repositories/appointmentRepository.js';

export async function getCompanyAppointmentsInRange({ companyId, rangeStart, rangeEnd }) {
  return listAppointmentsByCompanyAndRange({ companyId, rangeStart, rangeEnd });
}

export async function hasOverlappingAppointment({ companyId, rangeStart, rangeEnd }) {
  const overlaps = await listOverlappingAppointmentsByCompany({ companyId, rangeStart, rangeEnd });
  return overlaps.length > 0;
}

export async function createPublicAppointmentRecord(payload) {
  return createPublicAppointment(payload);
}
