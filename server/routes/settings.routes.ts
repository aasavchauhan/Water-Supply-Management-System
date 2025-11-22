import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { dbService } from '../services/database.service';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const settings = await dbService.getSettings(req.userId!);
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', async (req: AuthRequest, res: Response) => {
  try {
    const settings = await dbService.createOrUpdateSettings({
      ...req.body,
      userId: req.userId!
    });
    res.json(settings);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
