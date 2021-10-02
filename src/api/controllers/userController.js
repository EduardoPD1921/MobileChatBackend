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
}; 

exports.checkUniqueEmail = async (req, res, _next) => {
  const duplicateValue = await User.checkUniqueEmail(req.params.email);

  res.status(200).send(duplicateValue);
};

exports.checkUniquePhone = async (req, res, _next) => {
  const duplicateValue = await User.checkUniquePhone(req.params.phone);

  res.status(200).send(duplicateValue);
};