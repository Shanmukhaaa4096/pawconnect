import { repository } from '../store/inMemoryStore.js';

export const listNotifications = async (req, res) => {
  try {
    const data = await repository.getNotifications(req.user._id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load notifications', error: error.message });
  }
};

export const markRead = async (req, res) => {
  try {
    await repository.markNotificationsRead(req.user._id, req.params.id);
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification', error: error.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await repository.markNotificationsRead(req.user._id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notifications', error: error.message });
  }
};
