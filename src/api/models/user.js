const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const JwtService = require('../services/JwtService');
const HashService = require('../services/HashService');

class User {
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
    this.password = userPassword;
  }

  get getUserPassword() {
    return this.password;
  }

  set userPhone(userPhone) {
    const unmaskedPhone = userPhone
      .replace('(', '')
      .replace(')', '')
      .replace('-', '')
      .replace(' ', '');

    this.phone = unmaskedPhone;
  }

  get getUserPhone() {
    return this.phone;
  }

  static checkEmailExists(email) {
    return this.exists({ email });
  }

  static checkUniquePhone(phone) {
    return this.exists({ phone });
  }

  static async tryAuth(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (passwordCompare) {
        const token = JwtService.generateToken({
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          phone: user.phone
        });

        return token;
      }
      throw new Error('wrong-password');
    }
    throw new Error('wrong-email');
  }
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Insira um nome.']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'E-mail inválido.']
  },
  phone: {
    type: String,
    unique: [true, 'Telefone já cadastrado.'],
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