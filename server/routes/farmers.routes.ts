import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { dbService } from '../services/database.service';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const farmers = await dbService.getAllFarmers(req.userId!);
    res.json(farmers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const farmer = await dbService.getFarmerById(req.params.id, req.userId!);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.json(farmer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const farmer = await dbService.createFarmer({
      ...req.body,
      userId: req.userId,
      balance: 0,
      isActive: true
    });
    res.status(201).json(farmer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const farmer = await dbService.updateFarmer(req.params.id, req.userId!, req.body);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.json(farmer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await dbService.deleteFarmer(req.params.id, req.userId!);
    if (!deleted) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
