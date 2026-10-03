import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { repository } from '../store/inMemoryStore.js';

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'pawconnect_super_secret_jwt_key_2026_adopt_pets';
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    secret,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, organization, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await repository.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email address already exists' });
    }

    const validRole = ['adopter', 'shelter', 'admin'].includes(role) ? role : 'adopter';

    const user = await repository.createUser({
      name,
      email,
      password,
      role: validRole,
      phone: phone || '',
      location: location || { city: '', state: '' },
      organization: validRole === 'shelter' ? (organization || { name, verified: true }) : {},
      bio: bio || '',
      avatar:
        validRole === 'shelter'
          ? 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    const token = generateToken(user);
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await repository.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user.toObject ? user.toObject() : user;

    res.json({
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await repository.findUserById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, bio, organization, avatar } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (location) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (organization && req.user.role === 'shelter') updateData.organization = organization;
    if (avatar) updateData.avatar = avatar;

    const updatedUser = await repository.updateUser(req.user._id, updateData);
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};
