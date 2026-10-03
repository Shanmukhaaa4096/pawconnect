let ioInstance = null;

export const initChatSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 [Socket.io] Client connected: ${socket.id}`);

    // User can join their own private user room for direct alerts
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`👤 [Socket.io] User ${userId} joined personal notification room`);
      }
    });

    // Join a conversation room
    socket.on('join_conversation', (conversationId) => {
      if (conversationId) {
        socket.join(conversationId);
        console.log(`💬 [Socket.io] Socket ${socket.id} joined conversation room: ${conversationId}`);
      }
    });

    // Leave a conversation room
    socket.on('leave_conversation', (conversationId) => {
      if (conversationId) {
        socket.leave(conversationId);
        console.log(`👋 [Socket.io] Socket ${socket.id} left conversation room: ${conversationId}`);
      }
    });

    // Real-time typing indicators
    socket.on('typing', ({ conversationId, userName, isTyping }) => {
      socket.to(conversationId).emit('user_typing', { conversationId, userName, isTyping });
    });

    // Direct message event fallback
    socket.on('send_chat_message', (data) => {
      const { conversationId } = data;
      if (conversationId) {
        socket.to(conversationId).emit('receive_message', data);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => ioInstance;
