import pool from './db';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database initialization...');

    // Create users table (for custom user management if needed)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Users table created');

    // Create farmers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS farmers (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        mobile TEXT,
        farm_location TEXT,
        default_rate DECIMAL(10, 2),
        balance DECIMAL(10, 2) DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Farmers table created');

    // Create supply_entries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS supply_entries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        farmer_id TEXT NOT NULL,
        date DATE NOT NULL,
        billing_method TEXT NOT NULL CHECK (billing_method IN ('time', 'meter')),
        start_time TEXT,
        stop_time TEXT,
        pause_duration DECIMAL(10, 2) DEFAULT 0,
        meter_reading_start DECIMAL(10, 2),
        meter_reading_end DECIMAL(10, 2),
        total_time_used DECIMAL(10, 2),
        total_water_used DECIMAL(10, 2),
        rate DECIMAL(10, 2) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
      );
    `);
    console.log('✅ Supply entries table created');

    // Create payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        farmer_id TEXT NOT NULL,
        payment_date DATE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method TEXT NOT NULL,
        transaction_id TEXT,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
      );
    `);
    console.log('✅ Payments table created');

    // Create settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        business_name TEXT,
        business_address TEXT,
        business_phone TEXT,
        business_email TEXT,
        default_hourly_rate DECIMAL(10, 2) DEFAULT 100,
        currency TEXT DEFAULT 'INR',
        currency_symbol TEXT DEFAULT '₹',
        timezone TEXT DEFAULT 'Asia/Kolkata',
        date_format TEXT DEFAULT 'DD/MM/YYYY',
        time_format TEXT DEFAULT '24h',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Settings table created');

    // Create audit_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        old_values JSONB,
        new_values JSONB,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Audit logs table created');

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_farmers_user_id ON farmers(user_id);
      CREATE INDEX IF NOT EXISTS idx_supply_entries_user_id ON supply_entries(user_id);
      CREATE INDEX IF NOT EXISTS idx_supply_entries_farmer_id ON supply_entries(farmer_id);
      CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
      CREATE INDEX IF NOT EXISTS idx_payments_farmer_id ON payments(farmer_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
    `);
    console.log('✅ Indexes created');

    console.log('🎉 Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase().catch(console.error);
