const socketio = require('socket.io');

let io;

const init = (server) => {
  io = socketio(server, {
    cors: {
      origin: '*', // For dev, restrict in prod
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Allow clients to join specific rooms (e.g., for specific shipments)
    socket.on('joinShipment', (shipmentId) => {
      socket.join(`shipment_${shipmentId}`);
      console.log(`Client joined shipment room: shipment_${shipmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { init, getIO };
