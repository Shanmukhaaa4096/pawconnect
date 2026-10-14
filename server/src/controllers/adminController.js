import { repository } from '../store/inMemoryStore.js';

export const listUsers = async (req, res) => {
  try {
    const users = await repository.findAllUsers();
    res.json({ count: users.length, users });
  } catch (error) {
    console.error('listUsers error:', error);
    res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
};

export const setUserSuspended = async (req, res) => {
  try {
    const { id } = req.params;
    const suspended = Boolean(req.body.suspended);

    if (id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot suspend your own account' });
    }

    const target = await repository.findUserById(id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    if (target.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be suspended' });
    }

    const user = await repository.updateUser(id, { isSuspended: suspended });
    res.json({ message: suspended ? 'User suspended' : 'User reinstated', user });
  } catch (error) {
    console.error('setUserSuspended error:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};
