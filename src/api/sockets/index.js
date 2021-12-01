const db = require('../db/connection');
const User = db.model('User');
const Chat = db.model('Chat');

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
    const query = await User.sendContactInvite(senderInfo, receiverId);
    const receiverConnection = currentConnectedUsers.filter(user => {
      if (user.id === receiverId) {
        return true;
      }
    });

    socket.emit('getSendedNotificationInvite', query.updatedNotifications, receiverId);
    socket.to(receiverConnection[0].socketId).emit('contactInviteReceived', query.updatedNotifications, query.sender);
  };

  async function cancelContactInvite(senderInfo, receiverId) {
    const query = await User.cancelContactInvite(senderInfo, receiverId);
    const canceledConnection = currentConnectedUsers.filter(user => {
      if (user.id === receiverId) {
        return true;
      }
    });

    socket.to(canceledConnection[0].socketId).emit('contactInviteCanceled', query);
  };

  async function acceptContactInvite(authUserInfo, contactInfo) {
    const updatedInfo = await User.acceptContactInvite(authUserInfo, contactInfo);
    const contactUserConnection = currentConnectedUsers.filter(user => {
      if (user.id === contactInfo.id) {
        return true;
      }
    });

    socket.emit('getUpdatedNotificationList', updatedInfo.updatedNotifications);
    socket.to(contactUserConnection[0].socketId).emit('getUpdatedContacts', updatedInfo.contactUser);
  };

  async function createChat(chatUsers) {
    const chat = new Chat({
      chatType: 'chat',
      chatUsers
    });
    await chat.save();

    socket.emit('sendUserNewChat', chat);
  };

  function onUserDisconnected() {
    const userIndex = currentConnectedUsers.findIndex(user => user.socketId === socket.id);
    currentConnectedUsers.splice(userIndex, 1);

    console.log(currentConnectedUsers);
  };

  socket.on('userConnected', onUserConnected);
  socket.on('sendContactInvite', sendContactInvite);
  socket.on('cancelContactInvite', cancelContactInvite);
  socket.on('acceptContactInvite', acceptContactInvite);
  socket.on('createChat', createChat);
  socket.on('disconnect', onUserDisconnected);
};