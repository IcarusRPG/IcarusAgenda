import { env } from '../config/env';
import { getStoredToken } from './authStorage';

export async function httpClient(path, options = {}) {
  const { authToken, headers: customHeaders, ...fetchOptions } = options;
  const token = authToken === undefined ? getStoredToken() : authToken;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders || {}),
  };

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Erro inesperado na API.');
  }

  return response.json();
}
