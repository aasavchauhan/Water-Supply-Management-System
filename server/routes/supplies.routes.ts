import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { dbService } from '../services/database.service';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const entries = await dbService.getAllSupplyEntries(req.userId!);
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const entry = await dbService.createSupplyEntry({
      ...req.body,
      userId: req.userId
    });

    // Update farmer balance
    const farmer = await dbService.getFarmerById(req.body.farmerId, req.userId!);
    if (farmer) {
      await dbService.updateFarmer(farmer.id, req.userId!, {
        balance: farmer.balance - entry.amount
      });
    }

    res.status(201).json(entry);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
