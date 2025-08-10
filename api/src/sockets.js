module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('joinOrderRoom', ({ orderId }) => {
      socket.join(`order_${orderId}`);
    });

    // agent location updates: { orderId, lat, lng }
    socket.on('agentLocation', (data) => {
      // broadcast to order room
      io.to(`order_${data.orderId}`).emit('order:agentLocation', { lat: data.lat, lng: data.lng });
    });

    socket.on('disconnect', () => console.log('socket disconnected', socket.id));
  });
};
