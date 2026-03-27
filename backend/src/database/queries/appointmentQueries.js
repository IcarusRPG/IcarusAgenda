export const appointmentQueries = {
  listByCompanyAndRange: `
    SELECT id, company_id, service_id, customer_name, customer_email, scheduled_start,
           scheduled_end, status, source, notes, created_at, updated_at
    FROM appointments
    WHERE company_id = $1
      AND scheduled_start >= $2
      AND scheduled_start < $3
    ORDER BY scheduled_start ASC
  `,
};
