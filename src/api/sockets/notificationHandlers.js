const db = require('../db/connection');
const User = db.model('User');

const currentConnectedUsers = [];

module.exports = (io, socket) => {
  async function onUserConnected(userInfo) {
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

  async function sendContactInvite(senderInfo, receiverId) {
    const notification = await User.sendContactInvite(senderInfo, receiverId);
    const receiverConnection = currentConnectedUsers.filter(user => {
      if (user.id === receiverId) {
        return true;
      }
    });
    console.log(receiverConnection[0]);
    socket.emit('getSendedNotificationInvite', notification);
    socket.to(receiverConnection[0].socketId).emit('contactInviteReceived', notification);
  };

  function onUserDisconnected() {
    const userIndex = currentConnectedUsers.findIndex(user => user.socketId === socket.id);
    currentConnectedUsers.splice(userIndex, 1);

    console.log(currentConnectedUsers);
  };

  socket.on('userConnected', onUserConnected);
  socket.on('sendContactInvite', sendContactInvite);
  socket.on('disconnect', onUserDisconnected);
};