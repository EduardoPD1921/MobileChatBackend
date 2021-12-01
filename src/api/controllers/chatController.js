const db = require('../db/connection');
const Chat = db.model('Chat');

exports.store = async (req, res, _next) => {
  try {
    const chat = new Chat({
      chatType: 'chat',
      chatUsers: req.body.chatUsers
    });
    await chat.save();

    res.status(201).send(chat);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getUserChats = async (req, res, _next) => {
  try {
    const chats = await Chat.getUserChats(res.locals.token);
    res.status(200).send(chats);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};