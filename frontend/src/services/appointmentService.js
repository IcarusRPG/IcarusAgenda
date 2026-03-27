import { httpClient } from './httpClient';

export async function getAppointments({ date, view }) {
  const search = new URLSearchParams({ date, view });
  return httpClient(`/appointments?${search.toString()}`);
}

export async function updateAppointmentStatus(appointmentId, status) {
  return httpClient(`/appointments/${appointmentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function updateAppointment(appointmentId, payload) {
  return httpClient(`/appointments/${appointmentId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
