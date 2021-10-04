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
  } catch(error) {
    res.status(400).send(error);
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
    const userToken = await User.tryAuth(req.body.email, req.body.password);
    console.log(userToken); 
  } catch(error) {
    console.log(error);
  }
};