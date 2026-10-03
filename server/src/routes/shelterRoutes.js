import express from 'express';
import { getShelters, getShelterById, getPlatformStats } from '../controllers/shelterController.js';

const router = express.Router();

router.get('/stats', getPlatformStats);
router.get('/', getShelters);
router.get('/:id', getShelterById);

export default router;
