import { listAppointmentsByCompanyAndRange } from '../../database/repositories/appointmentRepository.js';

export async function getCompanyAppointmentsInRange({ companyId, rangeStart, rangeEnd }) {
  return listAppointmentsByCompanyAndRange({ companyId, rangeStart, rangeEnd });
}
