const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class User {
  get getUserId() {
    return this._id;
  }

  set userName(userName) {
    this.name = userName;
  }

  get getUserName() {
    return this.name;
  }

  set userEmail(userEmail) {
    this.email = userEmail;
  }

  get getUserEmail() {
    return this.email;
  }

  set userPassword(userPassword) {
    const hashedPassword = bcrypt.hashSync(userPassword, parseInt(process.env.ENCRIPT_SALT_ROUNDS));
    this.password = hashedPassword;
  }

  get getUserPassword() {
    return this.password;
  }

  set userPhone(userPhone) {
    this.phone = userPhone;
  }

  get getUserPhone() {
    return this.phone;
  }
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Insira um nome.']
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'E-mail inválido.']
  },
  phone: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Insira um número.']
  },
  password: {
    type: String,
    required: [true, 'Insira uma senha.']
  }
});

userSchema.loadClass(User);

module.exports = userSchema;