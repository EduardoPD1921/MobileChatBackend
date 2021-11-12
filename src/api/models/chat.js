const mongoose = require('mongoose');

class Chat {
  set chatType(chatType) {
    this.type = chatType;
  }
  
  get getChatType() {
    return this.type;
  }

  set chatUsers(chatUsers) {
    this.users = chatUsers;
  }

  get getChatUsers() {
    return this.users;
  }
};

const chatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['chat', 'group'],
    required: true
  },
  users: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      required: true
    }
  }],
  messages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    sendDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }]
});

chatSchema.loadClass(Chat);

module.exports = chatSchema;