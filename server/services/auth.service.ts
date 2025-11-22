import pool from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../src/types';

export class AuthService {
  async register(email: string, password: string, fullName: string): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `user_${Date.now()}`;
    const now = new Date().toISOString();

    const result = await pool.query(
      `INSERT INTO users (id, email, password, full_name, role, created_at, updated_at, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, full_name, role, created_at, updated_at, is_active`,
      [id, email, hashedPassword, fullName, 'user', now, now, true]
    );

    const user = this.mapUser(result.rows[0]);
    const token = this.generateToken(user.id);

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
    
    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await pool.query('UPDATE users SET last_login = $1 WHERE id = $2', [new Date().toISOString(), user.id]);

    const mappedUser = this.mapUser(user);
    const token = this.generateToken(user.id);

    return { user: mappedUser, token };
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const result = await pool.query(
      'SELECT id, email, full_name, role, created_at, updated_at, last_login, is_active FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows.length > 0 ? this.mapUser(result.rows[0]) : null;
  }

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  }

  private mapUser(row: any): Omit<User, 'password'> {
    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLogin: row.last_login,
      isActive: row.is_active
    };
  }
}

export const authService = new AuthService();
