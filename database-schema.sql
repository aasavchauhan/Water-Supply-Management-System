-- Water Supply Management System - PostgreSQL Schema
-- For Neon DB or any PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (For future authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'entry' CHECK (role IN ('owner', 'update', 'entry')),
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Farmers Table
CREATE TABLE IF NOT EXISTS farmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  farm_location TEXT,
  default_rate DECIMAL(10, 2) DEFAULT 100.00,
  balance DECIMAL(12, 2) DEFAULT 0.00,
  total_supplies INTEGER DEFAULT 0,
  total_water_used DECIMAL(12, 2) DEFAULT 0.00,
  total_hours DECIMAL(10, 2) DEFAULT 0.00,
  last_supply_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT farmers_mobile_check CHECK (LENGTH(mobile) >= 10)
);

-- Supply Entries Table
CREATE TABLE IF NOT EXISTS supply_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  billing_method VARCHAR(20) NOT NULL CHECK (billing_method IN ('meter', 'time')),
  
  -- Meter-based fields
  meter_reading_start DECIMAL(10, 2),
  meter_reading_end DECIMAL(10, 2),
  
  -- Time-based fields
  start_time TIME,
  stop_time TIME,
  pause_duration DECIMAL(5, 2) DEFAULT 0.00,
  
  -- Common fields
  total_time_used DECIMAL(10, 2) NOT NULL,
  water_used DECIMAL(12, 2),
  rate DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  remarks TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  CONSTRAINT supply_total_time_positive CHECK (total_time_used >= 0),
  CONSTRAINT supply_amount_positive CHECK (amount >= 0)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'upi', 'bank_transfer', 'cheque', 'other')),
  transaction_id VARCHAR(255),
  remarks TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  CONSTRAINT payment_amount_positive CHECK (amount > 0)
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) DEFAULT 'Water Supply Services',
  contact_number VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  default_rate DECIMAL(10, 2) DEFAULT 100.00,
  currency VARCHAR(10) DEFAULT 'INR',
  date_format VARCHAR(50) DEFAULT 'dd/MM/yyyy',
  water_flow_rate DECIMAL(10, 2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_farmers_user_id ON farmers(user_id);
CREATE INDEX IF NOT EXISTS idx_farmers_mobile ON farmers(mobile);
CREATE INDEX IF NOT EXISTS idx_farmers_name ON farmers(name);
CREATE INDEX IF NOT EXISTS idx_farmers_balance ON farmers(balance);

CREATE INDEX IF NOT EXISTS idx_supply_farmer_id ON supply_entries(farmer_id);
CREATE INDEX IF NOT EXISTS idx_supply_date ON supply_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_supply_farmer_date ON supply_entries(farmer_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_payment_farmer_id ON payments(farmer_id);
CREATE INDEX IF NOT EXISTS idx_payment_date ON payments(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_payment_farmer_date ON payments(farmer_id, payment_date DESC);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_farmers_updated_at BEFORE UPDATE ON farmers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supply_entries_updated_at BEFORE UPDATE ON supply_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update farmer statistics
CREATE OR REPLACE FUNCTION update_farmer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE farmers
    SET
      total_supplies = (SELECT COUNT(*) FROM supply_entries WHERE farmer_id = NEW.farmer_id),
      total_water_used = COALESCE((SELECT SUM(water_used) FROM supply_entries WHERE farmer_id = NEW.farmer_id), 0),
      total_hours = COALESCE((SELECT SUM(total_time_used) FROM supply_entries WHERE farmer_id = NEW.farmer_id), 0),
      last_supply_date = (SELECT MAX(date) FROM supply_entries WHERE farmer_id = NEW.farmer_id),
      balance = COALESCE((SELECT SUM(amount) FROM supply_entries WHERE farmer_id = NEW.farmer_id), 0) - 
                COALESCE((SELECT SUM(amount) FROM payments WHERE farmer_id = NEW.farmer_id), 0)
    WHERE id = NEW.farmer_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE farmers
    SET
      total_supplies = (SELECT COUNT(*) FROM supply_entries WHERE farmer_id = OLD.farmer_id),
      total_water_used = COALESCE((SELECT SUM(water_used) FROM supply_entries WHERE farmer_id = OLD.farmer_id), 0),
      total_hours = COALESCE((SELECT SUM(total_time_used) FROM supply_entries WHERE farmer_id = OLD.farmer_id), 0),
      last_supply_date = (SELECT MAX(date) FROM supply_entries WHERE farmer_id = OLD.farmer_id),
      balance = COALESCE((SELECT SUM(amount) FROM supply_entries WHERE farmer_id = OLD.farmer_id), 0) - 
                COALESCE((SELECT SUM(amount) FROM payments WHERE farmer_id = OLD.farmer_id), 0)
    WHERE id = OLD.farmer_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER supply_entries_update_stats
AFTER INSERT OR UPDATE OR DELETE ON supply_entries
FOR EACH ROW EXECUTE FUNCTION update_farmer_stats();

CREATE TRIGGER payments_update_stats
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW EXECUTE FUNCTION update_farmer_stats();

-- Insert default settings
INSERT INTO settings (business_name, default_rate, currency, date_format)
VALUES ('Kumar Water Supply Services', 100.00, 'INR', 'dd/MM/yyyy')
ON CONFLICT DO NOTHING;

-- Sample data (optional - remove in production)
-- INSERT INTO farmers (name, mobile, farm_location, default_rate)
-- VALUES 
--   ('Rajesh Kumar', '9876543210', 'Village Rampur, Plot 15', 120.00),
--   ('Suresh Patel', '9876543211', 'Near Highway, Sector 12', 100.00),
--   ('Mahesh Singh', '9876543212', 'Green Valley Farm', 110.00);
