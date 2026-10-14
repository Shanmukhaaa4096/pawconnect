import express from 'express';
import {
  getProducts,
  getProductById,
  createOrder,
  getMyOrders,
  getOrderById,
  getDeliveryTracking,
  submitFeedback,
} from '../controllers/shopController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// Protected routes (require auth)
router.post('/orders', verifyToken, createOrder);
router.get('/orders/mine', verifyToken, getMyOrders);
router.get('/orders/:id', verifyToken, getOrderById);
router.get('/orders/:orderId/delivery', verifyToken, getDeliveryTracking);
router.post('/orders/:orderId/feedback', verifyToken, submitFeedback);

export default router;
