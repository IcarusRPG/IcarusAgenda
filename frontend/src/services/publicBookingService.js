import { httpClient } from './httpClient';

export async function getPublicCompany(slug) {
  return httpClient(`/public/companies/${slug}`, {
    authToken: null,
  });
}

export async function getPublicServices(slug) {
  return httpClient(`/public/companies/${slug}/services`, {
    authToken: null,
  });
}

export async function getPublicAvailability({ slug, serviceId, date }) {
  const searchParams = new URLSearchParams({
    serviceId,
    date,
  });

  return httpClient(`/public/companies/${slug}/availability?${searchParams.toString()}`, {
    authToken: null,
  });
}

export async function createPublicAppointment(payload) {
  return httpClient('/public/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
    authToken: null,
  });
}
