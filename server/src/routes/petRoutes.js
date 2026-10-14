import express from 'express';
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  updatePetStatus,
} from '../controllers/petController.js';
import { verifyToken, optionalAuth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', optionalAuth, getPets);
router.get('/:id', optionalAuth, getPetById);

// Shelter / Admin protected routes
router.post(
  '/',
  verifyToken,
  requireRole('shelter', 'owner', 'admin'),
  upload.array('photos', 5),
  createPet
);
router.put('/:id', verifyToken, requireRole('shelter', 'owner', 'admin'), updatePet);
router.delete('/:id', verifyToken, requireRole('shelter', 'owner', 'admin'), deletePet);
router.patch('/:id/status', verifyToken, requireRole('shelter', 'owner', 'admin'), updatePetStatus);

export default router;
