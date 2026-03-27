import { AUTH_STORAGE_KEYS } from '../config/constants';

function readJson(key) {
  const raw = localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_STORAGE_KEYS.token);
}

export function getStoredUser() {
  return readJson(AUTH_STORAGE_KEYS.user);
}

export function getStoredTenant() {
  return readJson(AUTH_STORAGE_KEYS.tenant);
}

export function persistSession({ token, user, tenant }) {
  localStorage.setItem(AUTH_STORAGE_KEYS.token, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
  localStorage.setItem(AUTH_STORAGE_KEYS.tenant, JSON.stringify(tenant));
}

export function clearSession() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.token);
  localStorage.removeItem(AUTH_STORAGE_KEYS.user);
  localStorage.removeItem(AUTH_STORAGE_KEYS.tenant);
}
