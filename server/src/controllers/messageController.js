import { repository } from '../store/inMemoryStore.js';
import { getIO } from '../sockets/chatSocket.js';

export const getConversations = async (req, res) => {
  try {
    const conversations = await repository.getUserConversations(req.user._id);
    res.json({ conversations });
  } catch (error) {
    console.error('getConversations error:', error);
    res.status(500).json({ message: 'Failed to retrieve conversations', error: error.message });
  }
};

export const startConversation = async (req, res) => {
  try {
    const { recipientId, petId } = req.body;
    if (!recipientId) {
      return res.status(400).json({ message: 'recipientId is required' });
    }

    const conversation = await repository.findOrCreateConversation(req.user._id, recipientId, petId);
    res.json({ conversation });
  } catch (error) {
    console.error('startConversation error:', error);
    res.status(500).json({ message: 'Failed to start conversation', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await repository.getMessagesByConversation(conversationId);
    res.json({ messages });
  } catch (error) {
    console.error('getMessages error:', error);
    res.status(500).json({ message: 'Failed to retrieve messages', error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, petId, text } = req.body;
    if (!conversationId || !receiverId || !text?.trim()) {
      return res.status(400).json({ message: 'conversationId, receiverId, and text are required' });
    }

    const message = await repository.createMessage({
      conversationId,
      senderId: req.user._id,
      receiverId,
      petId,
      text: text.trim(),
    });

    // Real-time broadcast via Socket.io
    try {
      const io = getIO();
      if (io) {
        io.to(conversationId).emit('receive_message', message);
        io.to(receiverId.toString()).emit('new_notification', {
          type: 'message',
          title: `New message from ${req.user.name}`,
          message,
        });
      }
    } catch (sockErr) {
      console.warn('Socket broadcast warning:', sockErr.message);
    }

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    console.error('sendMessage error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};
