import {
  createPublicAppointment,
  findAppointmentByIdAndCompany,
  listAppointmentsByCompanyAndRange,
  listOverlappingAppointmentsByCompany,
  listOverlappingAppointmentsByCompanyExcludingId,
  updateAppointmentByIdAndCompany,
  updateAppointmentStatusByIdAndCompany,
} from '../../database/repositories/appointmentRepository.js';
import { findActiveServiceByCompanyAndId } from '../../database/repositories/serviceRepository.js';

const APPOINTMENT_STATUS = new Set(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']);

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function parseDateInput(dateValue) {
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getRangeByView({ date, view }) {
  const base = parseDateInput(`${date}T00:00:00.000Z`);

  if (!base) {
    const error = new Error('Parâmetro date inválido. Use YYYY-MM-DD.');
    error.status = 400;
    throw error;
  }

  const normalizedView = view === 'week' ? 'week' : 'day';

  if (normalizedView === 'day') {
    const start = new Date(base);
    const end = new Date(base);
    end.setUTCDate(end.getUTCDate() + 1);

    return {
      view: normalizedView,
      rangeStart: start.toISOString(),
      rangeEnd: end.toISOString(),
    };
  }

  const dayOfWeek = (base.getUTCDay() + 6) % 7; // Monday=0
  const weekStart = new Date(base);
  weekStart.setUTCDate(weekStart.getUTCDate() - dayOfWeek);

  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

  return {
    view: normalizedView,
    rangeStart: weekStart.toISOString(),
    rangeEnd: weekEnd.toISOString(),
  };
}

export async function getCompanyAppointmentsCalendar({ companyId, date, view }) {
  const { rangeStart, rangeEnd, view: normalizedView } = getRangeByView({ date, view });

  const items = await listAppointmentsByCompanyAndRange({
    companyId,
    rangeStart,
    rangeEnd,
  });

  return {
    view: normalizedView,
    range_start: rangeStart,
    range_end: rangeEnd,
    items,
  };
}

export async function getCompanyAppointmentsInRange({ companyId, rangeStart, rangeEnd }) {
  return listAppointmentsByCompanyAndRange({ companyId, rangeStart, rangeEnd });
}

export async function hasOverlappingAppointment({ companyId, rangeStart, rangeEnd }) {
  const overlaps = await listOverlappingAppointmentsByCompany({ companyId, rangeStart, rangeEnd });
  return overlaps.length > 0;
}

export async function hasOverlappingAppointmentExcludingId({ companyId, appointmentId, rangeStart, rangeEnd }) {
  const overlaps = await listOverlappingAppointmentsByCompanyExcludingId({
    companyId,
    appointmentId,
    rangeStart,
    rangeEnd,
  });

  return overlaps.length > 0;
}

export async function changeAppointmentStatus({ companyId, appointmentId, status }) {
  const normalizedStatus = String(status || '').trim().toLowerCase();

  if (!APPOINTMENT_STATUS.has(normalizedStatus)) {
    const error = new Error('Status inválido para agendamento.');
    error.status = 400;
    throw error;
  }

  return updateAppointmentStatusByIdAndCompany({
    companyId,
    appointmentId,
    status: normalizedStatus,
  });
}

export async function editAppointment({ companyId, appointmentId, payload }) {
  const current = await findAppointmentByIdAndCompany({ companyId, appointmentId });

  if (!current) {
    return null;
  }

  const nextServiceId = payload.service_id || current.service_id;
  const nextCustomerName = payload.customer_name || current.customer_name;
  const nextCustomerEmail = payload.customer_email || current.customer_email;
  const nextNotes = payload.notes === undefined ? current.notes : payload.notes;

  const service = await findActiveServiceByCompanyAndId(companyId, nextServiceId);

  if (!service) {
    const error = new Error('Serviço ativo não encontrado para a empresa.');
    error.status = 400;
    throw error;
  }

  const nextStart = parseDateInput(payload.scheduled_start || current.scheduled_start);

  if (!nextStart) {
    const error = new Error('scheduled_start inválido.');
    error.status = 400;
    throw error;
  }

  const desiredEnd = payload.scheduled_end ? parseDateInput(payload.scheduled_end) : addMinutes(nextStart, service.duration_minutes);

  if (!desiredEnd || nextStart >= desiredEnd) {
    const error = new Error('scheduled_end inválido.');
    error.status = 400;
    throw error;
  }

  const expectedEnd = addMinutes(nextStart, service.duration_minutes);

  if (expectedEnd.toISOString() !== desiredEnd.toISOString()) {
    const error = new Error('scheduled_end deve respeitar a duração do serviço selecionado.');
    error.status = 400;
    throw error;
  }

  const hasConflict = await hasOverlappingAppointmentExcludingId({
    companyId,
    appointmentId,
    rangeStart: nextStart.toISOString(),
    rangeEnd: desiredEnd.toISOString(),
  });

  if (hasConflict) {
    const error = new Error('Conflito de horário com outro agendamento.');
    error.status = 409;
    throw error;
  }

  return updateAppointmentByIdAndCompany({
    companyId,
    appointmentId,
    serviceId: nextServiceId,
    customerName: nextCustomerName,
    customerEmail: nextCustomerEmail,
    scheduledStart: nextStart.toISOString(),
    scheduledEnd: desiredEnd.toISOString(),
    notes: nextNotes,
  });
}

export async function createPublicAppointmentRecord(payload) {
  return createPublicAppointment(payload);
}
