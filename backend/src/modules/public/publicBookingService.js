import { findCompanyBySlug } from '../../database/repositories/companyRepository.js';
import { listActiveServicesByCompanyId, findActiveServiceByCompanyAndId } from '../../database/repositories/serviceRepository.js';
import { listActiveAvailabilityByCompanyAndDay } from '../../database/repositories/availabilityRepository.js';
import { createPublicAppointmentRecord, hasOverlappingAppointment } from '../appointments/appointmentService.js';

function toIsoDateUtc(dateStr, timeStr) {
  const shortTime = String(timeStr || '').slice(0, 5);
  return new Date(`${dateStr}T${shortTime}:00.000Z`);
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function getWeekdayFromDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.getUTCDay();
}

function validateDateInput(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(dateStr || ''));
}

export async function getPublicCompanyBySlug(slug) {
  const company = await findCompanyBySlug(String(slug || '').trim().toLowerCase());

  if (!company || company.status !== 'active') {
    return null;
  }

  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    logo_url: company.logo_url,
    timezone: company.timezone,
  };
}

export async function getPublicServicesByCompanySlug(slug) {
  const company = await getPublicCompanyBySlug(slug);

  if (!company) {
    return null;
  }

  const services = await listActiveServicesByCompanyId(company.id);
  return {
    company,
    services,
  };
}

export async function getPublicAvailabilityByCompanySlug({ slug, serviceId, date }) {
  if (!validateDateInput(date)) {
    const error = new Error('Parâmetro date é obrigatório no formato YYYY-MM-DD.');
    error.status = 400;
    throw error;
  }

  const company = await getPublicCompanyBySlug(slug);

  if (!company) {
    return null;
  }

  const service = await findActiveServiceByCompanyAndId(company.id, serviceId);

  if (!service) {
    const error = new Error('Serviço ativo não encontrado para a empresa informada.');
    error.status = 404;
    throw error;
  }

  const dayOfWeek = getWeekdayFromDate(date);

  if (dayOfWeek === null) {
    const error = new Error('Data inválida.');
    error.status = 400;
    throw error;
  }

  const rules = await listActiveAvailabilityByCompanyAndDay(company.id, dayOfWeek);
  const slots = [];

  for (const rule of rules) {
    const windowStart = toIsoDateUtc(date, rule.start_time);
    const windowEnd = toIsoDateUtc(date, rule.end_time);

    let cursor = new Date(windowStart);

    while (addMinutes(cursor, service.duration_minutes) <= windowEnd) {
      const scheduledStart = new Date(cursor);
      const scheduledEnd = addMinutes(scheduledStart, service.duration_minutes);

      // eslint-disable-next-line no-await-in-loop
      const overlaps = await hasOverlappingAppointment({
        companyId: company.id,
        rangeStart: scheduledStart.toISOString(),
        rangeEnd: scheduledEnd.toISOString(),
      });

      if (!overlaps) {
        slots.push({
          scheduled_start: scheduledStart.toISOString(),
          scheduled_end: scheduledEnd.toISOString(),
        });
      }

      cursor = addMinutes(cursor, rule.slot_interval_minutes);
    }
  }

  return {
    company,
    service: {
      id: service.id,
      name: service.name,
      duration_minutes: service.duration_minutes,
    },
    date,
    timezone: company.timezone,
    slots,
  };
}

export async function createPublicAppointmentFromBooking(payload) {
  const { company_slug: companySlug, service_id: serviceId, customer_name: customerName, customer_email: customerEmail } =
    payload;
  const scheduledStart = payload.scheduled_start;
  const scheduledEnd = payload.scheduled_end;

  if (!companySlug || !serviceId || !customerName || !customerEmail || !scheduledStart || !scheduledEnd) {
    const error = new Error('Campos obrigatórios: company_slug, service_id, customer_name, customer_email, scheduled_start, scheduled_end.');
    error.status = 400;
    throw error;
  }

  const company = await getPublicCompanyBySlug(companySlug);

  if (!company) {
    const error = new Error('Empresa não encontrada para o slug informado.');
    error.status = 404;
    throw error;
  }

  const service = await findActiveServiceByCompanyAndId(company.id, serviceId);

  if (!service) {
    const error = new Error('Serviço ativo não encontrado para esta empresa.');
    error.status = 404;
    throw error;
  }

  const startDate = new Date(scheduledStart);
  const endDate = new Date(scheduledEnd);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate >= endDate) {
    const error = new Error('Intervalo de agendamento inválido.');
    error.status = 400;
    throw error;
  }

  const expectedEnd = addMinutes(startDate, service.duration_minutes);

  if (expectedEnd.toISOString() !== endDate.toISOString()) {
    const error = new Error('scheduled_end deve respeitar a duração do serviço selecionado.');
    error.status = 400;
    throw error;
  }

  const dailyAvailability = await getPublicAvailabilityByCompanySlug({
    slug: companySlug,
    serviceId: service.id,
    date: startDate.toISOString().slice(0, 10),
  });

  const slotIsAvailable = dailyAvailability.slots.some(
    (slot) => slot.scheduled_start === startDate.toISOString() && slot.scheduled_end === endDate.toISOString(),
  );

  if (!slotIsAvailable) {
    const error = new Error('Horário selecionado não está disponível para agendamento público.');
    error.status = 409;
    throw error;
  }

  const hasOverlap = await hasOverlappingAppointment({
    companyId: company.id,
    rangeStart: startDate.toISOString(),
    rangeEnd: endDate.toISOString(),
  });

  if (hasOverlap) {
    const error = new Error('Horário selecionado não está mais disponível.');
    error.status = 409;
    throw error;
  }

  return createPublicAppointmentRecord({
    companyId: company.id,
    serviceId: service.id,
    customerName: String(customerName).trim(),
    customerEmail: String(customerEmail).trim().toLowerCase(),
    scheduledStart: startDate.toISOString(),
    scheduledEnd: endDate.toISOString(),
    notes: payload.notes || null,
  });
}
