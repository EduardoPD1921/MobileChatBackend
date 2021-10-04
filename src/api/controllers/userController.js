const db = require('../db/connection');
const User = db.model('User');
const bcrypt = require('bcrypt');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

exports.store = async (req, res, _next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.userPassword, parseInt(process.env.ENCRIPT_SALT_ROUNDS));
    const user = new User({
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userPhone: req.body.userPhone,
      userPassword: hashedPassword
    });
    await user.save();
    res.status(201).send('user-created');
  } catch(error) {
    res.status(400).send(error);
  }
}; 

exports.checkUniqueEmail = async (req, res, _next) => {
  const duplicateValue = await User.checkUniqueEmail(req.params.email);

  res.status(200).send(duplicateValue);
};

exports.checkUniquePhone = async (req, res, _next) => {
  const unmaskedPhone = req.params.phone
    .replace('(', '')
    .replace(')', '')
    .replace('-', '')
    .replace(' ', '');

  const duplicateValue = await User.checkUniquePhone(unmaskedPhone);

  res.status(200).send(duplicateValue);
};

exports.tryAuth = async (req, res, _next) => {
  try {
    const userAuth = await User.tryAuth(req.body.email, req.body.password); 
  } catch(error) {

  }
};