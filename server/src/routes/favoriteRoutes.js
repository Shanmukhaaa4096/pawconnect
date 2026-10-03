import express from 'express';
import { getFavorites, toggleFavorite } from '../controllers/favoriteController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, requireRole('adopter', 'admin'), getFavorites);
router.post('/:petId', verifyToken, requireRole('adopter', 'admin'), toggleFavorite);

export default router;
