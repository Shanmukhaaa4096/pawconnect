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

    const validRole = ['adopter', 'owner', 'shelter', 'admin'].includes(role) ? role : 'adopter';

    const user = await repository.createUser({
      name,
      email,
      password,
      role: validRole,
      phone: phone || '',
      location: location || { city: '', state: '' },
      organization:
        validRole === 'shelter'
          ? {
              name: organization?.name || name,
              licenseNumber: organization?.licenseNumber || '',
              description: organization?.description || bio || '',
              website: organization?.website || '',
              verified: false,
            }
          : {},
      bio: bio || '',
      avatar:
        validRole === 'shelter'
          ? 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    const token = generateToken(user);
    const { password: _, ...safeUser } = user.toObject ? user.toObject() : user;
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: safeUser,
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

    if (user.isSuspended) {
      return res.status(403).json({ message: 'This account has been suspended. Contact an administrator.' });
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

export const lazyLogin = async (req, res) => {
  try {
    const { role = 'adopter', guestName } = req.body || {};
    const validRole = ['adopter', 'owner', 'shelter', 'admin'].includes(role) ? role : 'adopter';

    // Map role to standard default demo accounts
    const roleEmails = {
      adopter: 'adopter@pawconnect.org',
      shelter: 'shelter@pawconnect.org',
      owner: 'owner@pawconnect.org',
      admin: 'admin@pawconnect.org',
    };

    let targetEmail = roleEmails[validRole];
    let user = await repository.findUserByEmail(targetEmail);

    // If specific email not found, search by role
    if (!user) {
      user = await repository.findUserByRole(validRole);
    }

    // Demo pet owner: create once, with one pet they want to rehome.
    if (!user && validRole === 'owner') {
      user = await repository.createUser({
        name: 'Priya Sharma',
        email: roleEmails.owner,
        password: 'password123',
        role: 'owner',
        phone: '',
        location: { city: 'Austin', state: 'TX' },
        bio: 'Moving abroad and looking for a loving home for my dog, Coco.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      });
      await repository.createPet({
        name: 'Coco',
        species: 'Dog',
        breed: 'Chow Chow Mix',
        age: 3,
        gender: 'Female',
        size: 'Medium',
        weightKg: 11,
        health: { vaccinated: true, spayedNeutered: true, specialNeeds: false, microchipped: true },
        temperament: ['Friendly', 'Curious', 'Good with Kids'],
        goodWith: { children: true, dogs: true, cats: false },
        description:
          'Coco is a sweet, fluffy cuddle-bug who loves walks and belly rubs. I am moving abroad and cannot take her with me, so I am looking for a caring family.',
        photos: ['https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=800&q=80'],
        location: { city: 'Austin', state: 'TX' },
        adoptionFee: 0,
        status: 'Available',
        rehomingReason: 'I am moving abroad for work and cannot take Coco with me. She deserves a family who is home often.',
        shelter: user._id,
      });
    }

    // If still no user exists, provision a fresh guest account
    if (!user) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      user = await repository.createUser({
        name: guestName || `Guest ${validRole.charAt(0).toUpperCase() + validRole.slice(1)} ${randomSuffix}`,
        email: `guest_${validRole}_${randomSuffix}@pawconnect.org`,
        password: 'password123',
        role: validRole,
        phone: '',
        location: { city: 'Bengaluru', state: 'Karnataka' },
        organization: validRole === 'shelter' ? { name: 'Paws Haven Rescue', verified: true } : {},
        bio: 'Instant lazy login guest account exploring PawConnect.',
        avatar:
          validRole === 'shelter'
            ? 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user.toObject ? user.toObject() : user;

    res.json({
      message: 'Lazy login successful! Welcome to PawConnect.',
      token,
      user: safeUser,
      isLazyLogin: true,
    });
  } catch (error) {
    console.error('Lazy login error:', error);
    res.status(500).json({ message: 'Lazy login failed', error: error.message });
  }
};

