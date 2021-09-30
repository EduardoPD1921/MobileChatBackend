const conn = require('../db/connection');
const User = conn.model('User');

exports.store = async (req, res, _next) => {
  try {
    const user = new User({
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userPhone: req.body.userPhone,
      userPassword: req.body.userPassword
    });
    await user.save();
    res.status(201).send('user-created');
  } catch(error) {
    res.status(400).send(error);
  }
} 

