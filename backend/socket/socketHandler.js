export const configureSocket = (io) => {
  global.onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('register', (userId) => {
      global.onlineUsers.set(userId, socket.id);
      console.log(`👤 User ${userId} connected with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      for (const [uid, sid] of global.onlineUsers.entries()) {
        if (sid === socket.id) {
          global.onlineUsers.delete(uid);
          break;
        }
      }
      console.log('❌ Socket disconnected:', socket.id);
    });
  });
};

export const sendNotification = (io, userId, message) => {
  const socketId = global.onlineUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit('notification', message);
    console.log(`📨 Sent notification to ${userId}`);
  }
};