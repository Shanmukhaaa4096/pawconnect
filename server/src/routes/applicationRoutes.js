import express from 'express';
import {
  createApplication,
  getMyApplications,
  getShelterApplications,
  getApplicationById,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, requireRole('adopter', 'admin'), createApplication);
router.get('/my-applications', verifyToken, requireRole('adopter', 'admin'), getMyApplications);
router.get('/shelter-applications', verifyToken, requireRole('shelter', 'admin'), getShelterApplications);
router.get('/:id', verifyToken, getApplicationById);
router.patch('/:id/status', verifyToken, requireRole('shelter', 'admin'), updateApplicationStatus);

export default router;
