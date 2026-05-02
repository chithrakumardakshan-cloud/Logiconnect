CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('ADMIN','CUSTOMER','COMPANY')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  mobile VARCHAR(50),
  city VARCHAR(120),
  country VARCHAR(120),
  address1 TEXT,
  address2 TEXT,
  country_code VARCHAR(10),
  contact_person VARCHAR(255),
  established VARCHAR(50),
  team_size VARCHAR(50),
  approval_status VARCHAR(20) DEFAULT 'PENDING',
  services_offered JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id VARCHAR(40) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  company_email VARCHAR(255) NOT NULL,
  shipment_type VARCHAR(50),
  container_type VARCHAR(50),
  container_size VARCHAR(50),
  quantity VARCHAR(50),
  cargo_type VARCHAR(255),
  origin_port VARCHAR(255),
  origin_country VARCHAR(255),
  destination_port VARCHAR(255),
  destination_country VARCHAR(255),
  cargo_ready_date DATE,
  incoterm VARCHAR(50),
  status VARCHAR(50) DEFAULT 'New',
  quoted_price NUMERIC(12,2),
  response_note TEXT,
  vessel_name VARCHAR(255),
  voyage_number VARCHAR(255),
  pol_date DATE,
  pod_date DATE,
  booking_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(40) PRIMARY KEY,
  request_id VARCHAR(40),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  company_name VARCHAR(255),
  company_email VARCHAR(255),
  shipment_type VARCHAR(50),
  container_type VARCHAR(50),
  origin_port VARCHAR(255),
  origin_country VARCHAR(255),
  destination_port VARCHAR(255),
  destination_country VARCHAR(255),
  quoted_price NUMERIC(12,2),
  status VARCHAR(50) DEFAULT 'Pending',
  placed_booking BOOLEAN DEFAULT FALSE,
  placed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_request FOREIGN KEY (request_id) REFERENCES quote_requests(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(60) PRIMARY KEY,
  request_id VARCHAR(40),
  booking_id VARCHAR(40),
  company_name VARCHAR(255),
  company_email VARCHAR(255),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  route TEXT,
  file_name VARCHAR(255) NOT NULL,
  file_data TEXT,
  document_type VARCHAR(100),
  sender_type VARCHAR(50),
  receiver_type VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(40) PRIMARY KEY,
  booking_id VARCHAR(40),
  request_id VARCHAR(40),
  company_name VARCHAR(255),
  company_email VARCHAR(255),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  origin_port VARCHAR(255),
  origin_country VARCHAR(255),
  destination_port VARCHAR(255),
  destination_country VARCHAR(255),
  amount NUMERIC(12,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Pending',
  paid_at TIMESTAMP,
  receipt_data TEXT,
  receipt_name VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  CONSTRAINT fk_payment_request FOREIGN KEY (request_id) REFERENCES quote_requests(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_users_type ON users(type);
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(approval_status);
CREATE INDEX IF NOT EXISTS idx_quote_customer_email ON quote_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_quote_company_email ON quote_requests(company_email);
CREATE INDEX IF NOT EXISTS idx_booking_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_booking_company_email ON bookings(company_email);
CREATE INDEX IF NOT EXISTS idx_document_customer_email ON documents(customer_email);
CREATE INDEX IF NOT EXISTS idx_document_company_email ON documents(company_email);
CREATE INDEX IF NOT EXISTS idx_payment_customer_email ON payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_payment_company_email ON payments(company_email);
