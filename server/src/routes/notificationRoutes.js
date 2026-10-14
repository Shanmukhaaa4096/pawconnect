import express from 'express';
import { listNotifications, markRead, markAllRead } from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', listNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);

export default router;
