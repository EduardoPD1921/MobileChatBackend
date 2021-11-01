const db = require('../db/connection');
const User = db.model('User');
const HashService = require('../services/HashService');

exports.store = async (req, res, _next) => {
  try {
    const hashedPassword = await HashService.generateHash(req.body.userPassword);

    const user = new User({
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userPhone: req.body.userPhone,
      userPassword : hashedPassword
    });
    await user.save();
    res.status(201).send('user-created');
  } catch (error) {
    res.status(400).send({ message: error });
  }
}; 

exports.checkEmailExists = async (req, res, _next) => {
  try {
    const duplicateValue = await User.checkEmailExists(req.params.email);
    res.status(200).send(duplicateValue);
  } catch (error) {
    console.log(error);
  }
};

exports.checkUniquePhone = async (req, res, _next) => {
  try {
    const unmaskedPhone = req.params.phone
      .replace('(', '')
      .replace(')', '')
      .replace('-', '')
      .replace(' ', '');
  
    const duplicateValue = await User.checkUniquePhone(unmaskedPhone);
    res.status(200).send(duplicateValue);
  } catch (error) {
    console.log(error);
  }
};

exports.tryAuth = async (req, res, _next) => {
  try {
    const query = await User.tryAuth(req.body.email, req.body.password);
    res.status(200).send({ message: 'user-authenticated', token: query.token, userInfo: query.userInfo }); 
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.searchUsers = async (req, res, _next) => {
  try {
    const userParamsRegex = new RegExp(req.params.userParams, 'i');
    const searchedUsers = await User.searchUsers(userParamsRegex);

    res.status(200).send(searchedUsers);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.acceptContactInvite = async (req, res, _next) => {
  try {
    console.log(req.body.contactInfo);
    const updatedNotifications = await User.acceptContactInvite(res.locals.token, req.body.contactInfo);
    res.status(200).send(updatedNotifications);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getUserNotifications = async (req, res, _next) => {
  try {
    const userNotifications = await User.getUserNotifications(req.params.id);
    res.status(200).send(userNotifications);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};