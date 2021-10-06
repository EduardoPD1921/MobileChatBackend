const mongoose = require('mongoose');

class Message {
  set messageSenderId(messageSenderId) {
    this.senderId = messageSenderId;
  }

  get getMessageSenderId() {
    return this.messageSenderId;
  }

  set messageReceiverId(messageReceiverId) {
    this.receiverId = messageReceiverId;
  }

  get getMessageReceiverId() {
    return this.messageReceiverId;
  }

  set messageContet(messageContent) {
    this.content = messageContent;
  }

  get getMessageContent() {
    return this.content;
  }

  get getMessageSendDate() {
    return this.sendDate;
  }
};

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sendDate: {
    default: Date.now,
    required: true
  }
});

messageSchema.loadClass(Message);

module.exports = messageSchema;