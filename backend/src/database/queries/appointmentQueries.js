export const appointmentQueries = {
  listByCompanyAndRange: `
    SELECT a.id, a.company_id, a.service_id, s.name AS service_name, s.duration_minutes,
           a.customer_name, a.customer_email, a.scheduled_start, a.scheduled_end,
           a.status, a.source, a.notes, a.created_at, a.updated_at
    FROM appointments a
    INNER JOIN services s ON s.id = a.service_id AND s.company_id = a.company_id
    WHERE a.company_id = $1
      AND a.scheduled_start >= $2
      AND a.scheduled_start < $3
    ORDER BY a.scheduled_start ASC
  `,
  listOverlappingByCompany: `
    SELECT id, scheduled_start, scheduled_end, status
    FROM appointments
    WHERE company_id = $1
      AND status IN ('pending', 'confirmed')
      AND scheduled_start < $3
      AND scheduled_end > $2
  `,
  listOverlappingByCompanyExcludingId: `
    SELECT id, scheduled_start, scheduled_end, status
    FROM appointments
    WHERE company_id = $1
      AND id <> $2
      AND status IN ('pending', 'confirmed')
      AND scheduled_start < $4
      AND scheduled_end > $3
  `,
  findByIdAndCompany: `
    SELECT id, company_id, service_id, customer_name, customer_email,
           scheduled_start, scheduled_end, status, source, notes, created_at, updated_at
    FROM appointments
    WHERE company_id = $1
      AND id = $2
    LIMIT 1
  `,
  updateStatusByIdAndCompany: `
    UPDATE appointments
    SET status = $3,
        updated_at = NOW()
    WHERE company_id = $1
      AND id = $2
    RETURNING id, company_id, service_id, customer_name, customer_email,
              scheduled_start, scheduled_end, status, source, notes, created_at, updated_at
  `,
  updateByIdAndCompany: `
    UPDATE appointments
    SET service_id = $3,
        customer_name = $4,
        customer_email = $5,
        scheduled_start = $6,
        scheduled_end = $7,
        notes = $8,
        updated_at = NOW()
    WHERE company_id = $1
      AND id = $2
    RETURNING id, company_id, service_id, customer_name, customer_email,
              scheduled_start, scheduled_end, status, source, notes, created_at, updated_at
  `,
  createPublicSafe: `
    INSERT INTO appointments (
      company_id, service_id, customer_name, customer_email,
      scheduled_start, scheduled_end, status, source, notes
    )
    SELECT $1, $2, $3, $4, $5, $6, 'pending', 'public', $7
    WHERE NOT EXISTS (
      SELECT 1
      FROM appointments a
      WHERE a.company_id = $1
        AND a.status IN ('pending', 'confirmed')
        AND a.scheduled_start < $6
        AND a.scheduled_end > $5
    )
    RETURNING id, company_id, service_id, customer_name, customer_email,
              scheduled_start, scheduled_end, status, source, notes, created_at, updated_at
  `,
};
