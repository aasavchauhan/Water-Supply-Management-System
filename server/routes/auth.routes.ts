import { Router, Response } from 'express';
import { authService } from '../services/auth.service';

const router = Router();

router.post('/register', async (req, res: Response) => {
  try {
    const { email, password, fullName } = req.body;
    const { user, token } = await authService.register(email, password, fullName);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ user, token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/logout', (req, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', async (req, res: Response) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { userId } = authService.verifyToken(token);
    const user = await authService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

export default router;
