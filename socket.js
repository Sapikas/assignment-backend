let io;

module.exports = {
  init: httpServer => {
    io = require('socket.io')(httpServer, {
      cors: {
        origins: ["http://localhost:8080"]
      }
    });
    return io;
  },
  getIO: () => {
    if (!io){
      throw new Error('Socket.io not initialized!')
    }
    return io;
  }
}