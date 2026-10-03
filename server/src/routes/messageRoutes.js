import express from 'express';
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
} from '../controllers/messageController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', verifyToken, getConversations);
router.post('/conversations', verifyToken, startConversation);
router.get('/:conversationId', verifyToken, getMessages);
router.post('/', verifyToken, sendMessage);

export default router;
