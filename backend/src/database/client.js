import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

let pool;

export function getDbPool() {
  if (!pool) {
    if (!env.databaseUrl) {
      throw new Error('DATABASE_URL não configurada. Defina no .env para habilitar acesso ao PostgreSQL.');
    }

    pool = new Pool({
      connectionString: env.databaseUrl,
    });
  }

  return pool;
}

export async function dbQuery(text, params = []) {
  const activePool = getDbPool();
  return activePool.query(text, params);
}
