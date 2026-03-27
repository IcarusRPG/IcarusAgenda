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
  listOverlappingByCompany: `
    SELECT id, scheduled_start, scheduled_end, status
    FROM appointments
    WHERE company_id = $1
      AND status IN ('pending', 'confirmed')
      AND scheduled_start < $3
      AND scheduled_end > $2
  `,
  createPublic: `
    INSERT INTO appointments (
      company_id, service_id, customer_name, customer_email,
      scheduled_start, scheduled_end, status, source, notes
    )
    VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'public', $7)
    RETURNING id, company_id, service_id, customer_name, customer_email,
              scheduled_start, scheduled_end, status, source, notes, created_at, updated_at
  `,
};
