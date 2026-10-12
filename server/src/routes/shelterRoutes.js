import express from 'express';
import { getShelters, getShelterById, getPlatformStats, verifyShelter } from '../controllers/shelterController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', getPlatformStats);
router.get('/', getShelters);
router.get('/:id', getShelterById);
router.patch('/:id/verify', verifyToken, requireRole('admin'), verifyShelter);

export default router;
