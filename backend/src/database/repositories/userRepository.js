import { dbQuery } from '../client.js';
import { userQueries } from '../queries/userQueries.js';

export async function findActiveUserByEmail(email) {
  const { rows } = await dbQuery(userQueries.findActiveByEmail, [email]);
  return rows[0] || null;
}
