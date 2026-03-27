BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- Trigger helper for automatic updated_at maintenance.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(80) NOT NULL,
  logo_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  timezone VARCHAR(80) NOT NULL DEFAULT 'America/Sao_Paulo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT companies_slug_unique UNIQUE (slug),
  CONSTRAINT companies_status_check CHECK (status IN ('active', 'inactive', 'suspended')),
  CONSTRAINT companies_slug_format_check CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  booking_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  booking_advance_days SMALLINT NOT NULL DEFAULT 60,
  cancellation_notice_hours SMALLINT NOT NULL DEFAULT 24,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT company_settings_company_id_unique UNIQUE (company_id),
  CONSTRAINT company_settings_company_fk FOREIGN KEY (company_id)
    REFERENCES companies(id) ON DELETE CASCADE,
  CONSTRAINT company_settings_booking_advance_days_check CHECK (booking_advance_days BETWEEN 0 AND 365),
  CONSTRAINT company_settings_cancellation_notice_hours_check CHECK (cancellation_notice_hours BETWEEN 0 AND 168)
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name VARCHAR(120) NOT NULL,
  email CITEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'staff',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_company_fk FOREIGN KEY (company_id)
    REFERENCES companies(id) ON DELETE RESTRICT,
  CONSTRAINT users_role_check CHECK (role IN ('owner', 'admin', 'staff')),
  CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive', 'invited')),
  CONSTRAINT users_company_email_unique UNIQUE (company_id, email)
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  duration_minutes SMALLINT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT services_company_fk FOREIGN KEY (company_id)
    REFERENCES companies(id) ON DELETE RESTRICT,
  CONSTRAINT services_status_check CHECK (status IN ('active', 'inactive')),
  CONSTRAINT services_duration_minutes_check CHECK (duration_minutes BETWEEN 5 AND 1440),
  CONSTRAINT services_company_name_unique UNIQUE (company_id, name)
);

-- Composite unique key to support tenant-safe foreign key in appointments.
ALTER TABLE services
  ADD CONSTRAINT services_company_id_id_unique UNIQUE (company_id, id);

CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  day_of_week SMALLINT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_interval_minutes SMALLINT NOT NULL DEFAULT 30,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT availability_company_fk FOREIGN KEY (company_id)
    REFERENCES companies(id) ON DELETE RESTRICT,
  CONSTRAINT availability_day_of_week_check CHECK (day_of_week BETWEEN 0 AND 6),
  CONSTRAINT availability_time_range_check CHECK (start_time < end_time),
  CONSTRAINT availability_slot_interval_minutes_check CHECK (slot_interval_minutes BETWEEN 5 AND 240),
  CONSTRAINT availability_status_check CHECK (status IN ('active', 'inactive'))
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  service_id UUID NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_email CITEXT,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  source VARCHAR(20) NOT NULL DEFAULT 'public',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT appointments_company_fk FOREIGN KEY (company_id)
    REFERENCES companies(id) ON DELETE RESTRICT,
  CONSTRAINT appointments_company_service_fk FOREIGN KEY (company_id, service_id)
    REFERENCES services(company_id, id) ON DELETE RESTRICT,
  CONSTRAINT appointments_status_check CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  CONSTRAINT appointments_source_check CHECK (source IN ('internal', 'public')),
  CONSTRAINT appointments_time_range_check CHECK (scheduled_start < scheduled_end)
);

-- Indexes focused on tenant-aware queries.
CREATE INDEX idx_users_company_id ON users (company_id);
CREATE INDEX idx_services_company_id ON services (company_id);
CREATE INDEX idx_availability_company_id ON availability (company_id);
CREATE INDEX idx_appointments_company_id ON appointments (company_id);
CREATE INDEX idx_appointments_company_scheduled_start ON appointments (company_id, scheduled_start);
CREATE INDEX idx_appointments_company_status ON appointments (company_id, status);
CREATE INDEX idx_appointments_company_service ON appointments (company_id, service_id);
CREATE INDEX idx_users_company_role_status ON users (company_id, role, status);

-- Automatic updated_at triggers.
CREATE TRIGGER trg_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_company_settings_updated_at
  BEFORE UPDATE ON company_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_availability_updated_at
  BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
