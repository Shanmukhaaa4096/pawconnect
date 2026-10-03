import jwt from 'jsonwebtoken';
import { repository } from '../store/inMemoryStore.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'pawconnect_super_secret_jwt_key_2026_adopt_pets';
    const decoded = jwt.verify(token, secret);

    const user = await repository.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'pawconnect_super_secret_jwt_key_2026_adopt_pets';
      const decoded = jwt.verify(token, secret);
      const user = await repository.findUserById(decoded.id);
      if (user) req.user = user;
    }
  } catch (err) {
    // ignore optional token error
  }
  next();
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access forbidden: requires ${roles.join(' or ')} role` });
    }
    next();
  };
};
