import express from 'express';
import { listUsers, setUserSuspended } from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken, requireRole('admin'));
router.get('/users', listUsers);
router.patch('/users/:id/suspend', setUserSuspended);

export default router;
