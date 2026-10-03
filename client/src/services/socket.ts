import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const socketEndpoint =
      import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || '/';

    socket = io(socketEndpoint, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.io Client] Connected with ID:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚡ [Socket.io Client] Disconnected:', reason);
    });
  }
  return socket;
};

export const joinUserRoom = (userId: string) => {
  const s = getSocket();
  if (s && userId) {
    s.emit('join_user', userId);
  }
};

export const joinConversationRoom = (conversationId: string) => {
  const s = getSocket();
  if (s && conversationId) {
    s.emit('join_conversation', conversationId);
  }
};

export const leaveConversationRoom = (conversationId: string) => {
  const s = getSocket();
  if (s && conversationId) {
    s.emit('leave_conversation', conversationId);
  }
};
