const mongoose = require('mongoose');
const validator = require('validator');

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
    if (!email) {
      throw new Error('email-required');
    }

    if (!password) {
      throw new Error('password-required');
    }

    const user = await this.findOne({ email });
    if (user) {
      const passwordCompare = await HashService.compareHash(password, user.password);
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

  static decodeAuthToken(authToken) {
    try {
      const userInfo = JwtService.decodeToken(authToken);
      return userInfo;
    } catch (error) {
      throw new Error('invalid-token');
    }
  }

  static async searchUsers(regexParam) {
    try {
      const userDBSearch = await this.find({
        $or: [
          { name: regexParam },
          { email: regexParam }
        ]
      }, '_id name email phone notifications');

      return userDBSearch;
    } catch (error) {
      throw new Error('search-error');
    }
  }

  static async sendContactInvite(tokenId, receiverId) {
    try {
      const decodedToken = JwtService.decodeToken(tokenId);

      const query = await this.findByIdAndUpdate(receiverId, {
        $addToSet: {
          notifications: [{
            notificationType: 'addContactInvite',
            senderId: decodedToken.id,
            receiverId: receiverId
          }]
        }
      }, { returnOriginal: false });

      console.log(query);
    } catch (error) {
      throw new Error('invite-error');
    }
  }
};

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
  },
  contacts: [{
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
      unique: true,
      trim: true,
      required: true
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
      required: true
    }
  }],
  notifications: [{
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    notificationType: {
      type: String,
      enum: ['addContactInvite', 'groupInvite'],
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }]
});

userSchema.loadClass(User);

module.exports = userSchema;