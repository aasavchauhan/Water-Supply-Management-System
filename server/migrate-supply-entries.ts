import pool from './db';

/**
 * Migration script to update supply_entries table:
 * 1. Add CHECK constraint for billing_method
 * 2. Change pause_duration from INTEGER to DECIMAL
 */
async function migrateSupplyEntries() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting supply_entries table migration...');
    
    // Start transaction
    await client.query('BEGIN');
    
    // 1. Change pause_duration from INTEGER to DECIMAL
    await client.query(`
      ALTER TABLE supply_entries 
      ALTER COLUMN pause_duration TYPE DECIMAL(10, 2);
    `);
    console.log('✅ Changed pause_duration to DECIMAL(10, 2)');
    
    // 2. Add CHECK constraint for billing_method
    await client.query(`
      ALTER TABLE supply_entries
      ADD CONSTRAINT check_billing_method 
      CHECK (billing_method IN ('time', 'meter'));
    `);
    console.log('✅ Added CHECK constraint for billing_method');
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrateSupplyEntries().catch(console.error);
