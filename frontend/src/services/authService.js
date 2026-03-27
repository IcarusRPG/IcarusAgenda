import { httpClient } from './httpClient';

export async function login(payload) {
  return httpClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getCurrentCompany(authToken) {
  return httpClient('/companies/current', {
    authToken,
  });
}
