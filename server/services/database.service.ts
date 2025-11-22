import pool from '../db';
import { Farmer, SupplyEntry, Payment, Settings, AuditLog } from '../../src/types';

export class DatabaseService {
  // Farmers
  async getAllFarmers(userId: string): Promise<Farmer[]> {
    const result = await pool.query(
      'SELECT * FROM farmers WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map(this.mapFarmer);
  }

  async getFarmerById(id: string, userId: string): Promise<Farmer | null> {
    const result = await pool.query(
      'SELECT * FROM farmers WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows.length > 0 ? this.mapFarmer(result.rows[0]) : null;
  }

  async createFarmer(farmer: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Farmer> {
    const id = `farmer_${Date.now()}`;
    const now = new Date().toISOString();
    
    const result = await pool.query(
      `INSERT INTO farmers (id, user_id, name, mobile, farm_location, default_rate, balance, created_at, updated_at, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, farmer.userId, farmer.name, farmer.mobile, farmer.farmLocation, farmer.defaultRate, farmer.balance, now, now, farmer.isActive]
    );
    
    return this.mapFarmer(result.rows[0]);
  }

  async updateFarmer(id: string, userId: string, updates: Partial<Farmer>): Promise<Farmer | null> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'userId') {
        const dbKey = this.camelToSnake(key);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return this.getFarmerById(id, userId);

    fields.push(`updated_at = $${paramCount}`);
    values.push(now, id, userId);

    const result = await pool.query(
      `UPDATE farmers SET ${fields.join(', ')} WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2} RETURNING *`,
      values
    );

    return result.rows.length > 0 ? this.mapFarmer(result.rows[0]) : null;
  }

  async deleteFarmer(id: string, userId: string): Promise<boolean> {
    const now = new Date().toISOString();
    const result = await pool.query(
      'UPDATE farmers SET is_active = false, updated_at = $1 WHERE id = $2 AND user_id = $3',
      [now, id, userId]
    );
    return result.rowCount > 0;
  }

  // Supply Entries
  async getAllSupplyEntries(userId: string): Promise<SupplyEntry[]> {
    const result = await pool.query(
      'SELECT * FROM supply_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map(this.mapSupplyEntry);
  }

  async createSupplyEntry(entry: Omit<SupplyEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupplyEntry> {
    const id = `supply_${Date.now()}`;
    const now = new Date().toISOString();
    
    const result = await pool.query(
      `INSERT INTO supply_entries (id, user_id, farmer_id, date, billing_method, start_time, stop_time, 
       pause_duration, meter_reading_start, meter_reading_end, total_time_used, total_water_used, 
       rate, amount, remarks, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *`,
      [id, entry.userId, entry.farmerId, entry.date, entry.billingMethod, entry.startTime, entry.stopTime,
       entry.pauseDuration, entry.meterReadingStart, entry.meterReadingEnd, entry.totalTimeUsed, 
       entry.totalWaterUsed, entry.rate, entry.amount, entry.remarks, now, now]
    );
    
    return this.mapSupplyEntry(result.rows[0]);
  }

  // Payments
  async getAllPayments(userId: string): Promise<Payment[]> {
    const result = await pool.query(
      'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map(this.mapPayment);
  }

  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const id = `payment_${Date.now()}`;
    const now = new Date().toISOString();
    
    const result = await pool.query(
      `INSERT INTO payments (id, user_id, farmer_id, payment_date, amount, payment_method, 
       transaction_id, remarks, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, payment.userId, payment.farmerId, payment.paymentDate, payment.amount, payment.paymentMethod,
       payment.transactionId, payment.remarks, now, now]
    );
    
    return this.mapPayment(result.rows[0]);
  }

  // Settings
  async getSettings(userId: string): Promise<Settings | null> {
    const result = await pool.query(
      'SELECT * FROM settings WHERE user_id = $1',
      [userId]
    );
    return result.rows.length > 0 ? this.mapSettings(result.rows[0]) : null;
  }

  async createOrUpdateSettings(settings: Partial<Settings> & { userId: string }): Promise<Settings> {
    const existing = await this.getSettings(settings.userId);
    const now = new Date().toISOString();

    if (existing) {
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      Object.entries(settings).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt' && key !== 'userId') {
          const dbKey = this.camelToSnake(key);
          fields.push(`${dbKey} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      fields.push(`updated_at = $${paramCount}`);
      values.push(now, settings.userId);

      const result = await pool.query(
        `UPDATE settings SET ${fields.join(', ')} WHERE user_id = $${paramCount + 1} RETURNING *`,
        values
      );
      return this.mapSettings(result.rows[0]);
    } else {
      const id = `settings_${Date.now()}`;
      const result = await pool.query(
        `INSERT INTO settings (id, user_id, business_name, business_address, business_phone, 
         business_email, default_hourly_rate, currency, currency_symbol, timezone, date_format, 
         time_format, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *`,
        [id, settings.userId, settings.businessName || 'Water Irrigation Supply', 
         settings.businessAddress || null, settings.businessPhone || null, settings.businessEmail || null,
         settings.defaultHourlyRate || 100, settings.currency || 'INR', settings.currencySymbol || '₹',
         settings.timezone || 'Asia/Kolkata', settings.dateFormat || 'DD/MM/YYYY', 
         settings.timeFormat || '24h', now, now]
      );
      return this.mapSettings(result.rows[0]);
    }
  }

  // Audit Logs
  async createAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
    const id = `audit_${Date.now()}`;
    const now = new Date().toISOString();
    
    await pool.query(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, old_values, 
       new_values, ip_address, user_agent, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [id, log.userId, log.action, log.entityType, log.entityId, 
       log.oldValues ? JSON.stringify(log.oldValues) : null,
       log.newValues ? JSON.stringify(log.newValues) : null,
       log.ipAddress, log.userAgent, now]
    );
  }

  // Helper methods to map DB rows to TypeScript interfaces
  private mapFarmer(row: any): Farmer {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      mobile: row.mobile,
      farmLocation: row.farm_location,
      defaultRate: parseFloat(row.default_rate),
      balance: parseFloat(row.balance),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active
    };
  }

  private mapSupplyEntry(row: any): SupplyEntry {
    return {
      id: row.id,
      userId: row.user_id,
      farmerId: row.farmer_id,
      date: row.date,
      billingMethod: row.billing_method,
      startTime: row.start_time,
      stopTime: row.stop_time,
      pauseDuration: parseFloat(row.pause_duration),
      meterReadingStart: parseFloat(row.meter_reading_start),
      meterReadingEnd: parseFloat(row.meter_reading_end),
      totalTimeUsed: parseFloat(row.total_time_used),
      totalWaterUsed: parseFloat(row.total_water_used),
      rate: parseFloat(row.rate),
      amount: parseFloat(row.amount),
      remarks: row.remarks,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapPayment(row: any): Payment {
    return {
      id: row.id,
      userId: row.user_id,
      farmerId: row.farmer_id,
      paymentDate: row.payment_date,
      amount: parseFloat(row.amount),
      paymentMethod: row.payment_method,
      transactionId: row.transaction_id,
      remarks: row.remarks,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapSettings(row: any): Settings {
    return {
      id: row.id,
      userId: row.user_id,
      businessName: row.business_name,
      businessAddress: row.business_address,
      businessPhone: row.business_phone,
      businessEmail: row.business_email,
      defaultHourlyRate: parseFloat(row.default_hourly_rate),
      currency: row.currency,
      currencySymbol: row.currency_symbol,
      timezone: row.timezone,
      dateFormat: row.date_format,
      timeFormat: row.time_format,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

export const dbService = new DatabaseService();
