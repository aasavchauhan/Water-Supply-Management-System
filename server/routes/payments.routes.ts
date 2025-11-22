import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { dbService } from '../services/database.service';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const payments = await dbService.getAllPayments(req.userId!);
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const payment = await dbService.createPayment({
      ...req.body,
      userId: req.userId
    });

    // Update farmer balance
    const farmer = await dbService.getFarmerById(req.body.farmerId, req.userId!);
    if (farmer) {
      await dbService.updateFarmer(farmer.id, req.userId!, {
        balance: farmer.balance + payment.amount
      });
    }

    res.status(201).json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
