export const availabilityQueries = {
  listActiveByCompanyAndDay: `
    SELECT id, company_id, day_of_week, start_time, end_time, slot_interval_minutes, status
    FROM availability
    WHERE company_id = $1
      AND day_of_week = $2
      AND status = 'active'
    ORDER BY start_time ASC
  `,
};
