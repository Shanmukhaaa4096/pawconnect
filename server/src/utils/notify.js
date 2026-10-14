import { repository } from '../store/inMemoryStore.js';
import { getIO } from '../sockets/chatSocket.js';

/** Save a notification for a user and push it live over the socket. Never throws. */
export const notify = async (userId, payload) => {
  try {
    if (!userId) return null;
    const n = await repository.createNotification({ user: userId, ...payload });
    const io = getIO();
    if (io) io.to(userId.toString()).emit('notification', n);
    return n;
  } catch (err) {
    console.warn('notify failed:', err.message);
    return null;
  }
};
