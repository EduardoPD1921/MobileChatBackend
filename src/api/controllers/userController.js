const mongoose = require('mongoose');
const conn = require('../db/connection');
const User = conn.model('User');

exports.store = (req, res, next) => {
  const user = new User({
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    userPhone: req.body.userPhone,
    userPassword: req.body.userPassword
  });

  user.save();

  res.status(201).send(user);
} 

