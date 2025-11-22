import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export interface AuthRequest extends Request {
  userId?: string;
}

const STACK_API_URL = 'https://api.stack-auth.com/api/v1';
const STACK_SECRET_KEY = process.env.STACK_SECRET_SERVER_KEY;
const IS_DEV = process.env.NODE_ENV === 'development';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Development mode: bypass auth and use demo user
    if (IS_DEV) {
      console.log('[Auth] Development mode - bypassing authentication');
      req.userId = 'dev-user-123'; // Demo user ID for development
      return next();
    }

    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token with Stack Auth
    try {
      const response = await axios.get(`${STACK_API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-stack-secret-server-key': STACK_SECRET_KEY,
        },
      });

      const stackUser = response.data;
      req.userId = stackUser.id;
      next();
    } catch (error: any) {
      if (error.response?.status === 401) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
