const db = require('../db/connection');
const User = db.model('User');

const currentConnectedUsers = [];

module.exports = (io, socket) => {
  async function onUserConnected(userInfo) {
    console.log(io.engine.clientsCount);
    const userLocalization = {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      socketId: socket.id
    };

    currentConnectedUsers.push(userLocalization);
    console.log(currentConnectedUsers);

    const userNotifications = await User.getUserNotifications(userInfo.id);
    socket.emit('getUserNotifications', userNotifications);
  };

  function onUserDisconnected() {
    console.log(socket.id);
  };

  socket.on('userConnected', onUserConnected);
  socket.on('disconnect', onUserDisconnected);
};