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
        const userInfo = {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          phone: user.phone
        };

        const token = JwtService.generateToken(userInfo);

        return { token, userInfo };
      }
      throw new Error('wrong-password');
    }
    throw new Error('wrong-email');
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

  static async sendContactInvite(senderInfo, receiverId) {
    try {
      const query = await this.findByIdAndUpdate(receiverId, {
        $addToSet: {
          notifications: [{
            notificationType: 'addContactInvite',
            senderId: senderInfo.id,
            senderName: senderInfo.name,
            senderEmail: senderInfo.email,
            senderPhone: senderInfo.phone,
            receiverId: receiverId
          }]
        }
      }, { returnOriginal: false });

      return { updatedNotifications: query, sender: query.notifications[query.notifications.length - 1] }
    } catch (error) {
      throw new Error('invite-error');
    }
  }

  static async cancelContactInvite(senderInfo, receiverId) {
    try {
      const query = await this.findByIdAndUpdate(receiverId, {
        $pull: { notifications: { senderId: senderInfo.id } }
      }, { returnOriginal: false });

      return query;
    } catch (error) {
      throw new Error('cancel-invite-error');
    }
  }

  static async acceptContactInvite(authUserInfo, contactInfo) {
    try {
      const authUserQuery = await this.findByIdAndUpdate(authUserInfo.id, {
        $addToSet: {
          contacts: [{
            _id: contactInfo.id,
            name: contactInfo.name,
            email: contactInfo.email,
            phone: contactInfo.phone
          }]
        }
      }, { returnOriginal: false });

      const contactUser = await this.findByIdAndUpdate(contactInfo.id, {
        $addToSet: {
          contacts: [{
            _id: authUserInfo.id,
            name: authUserInfo.name,
            email: authUserInfo.email,
            phone: authUserInfo.phone
          }]
        }
      }, { returnOriginal: false });

      const updatedNotifications = await this.cancelContactInvite(contactInfo, authUserInfo.id);

      return { updatedNotifications, contactUser };
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getUserNotifications(userId) {
    try {
      const userNotifications = await this.findById(userId, 'notifications');
      return userNotifications;
    } catch (error) {
      throw new Error('get-user-notifications-error');
    }
  }

  static async getUserContacts(authToken) {
    try {
      const decodedToken = JwtService.decodeToken(authToken);
      const userContacts = await this.findById(decodedToken.id, 'contacts');

      return userContacts;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async deleteContact(authToken, contactId) {
    try {
      const decodedToken = JwtService.decodeToken(authToken);
      const authUserQuery = await this.findByIdAndUpdate(decodedToken.id, {
        $pull: { contacts: { _id: contactId } }
      }, { returnOriginal: false });
      const contactUserQuery = await this.findByIdAndUpdate(contactId, {
        $pull: { contacts: { _id: decodedToken.id } }
      });

      return authUserQuery;
    } catch (error) {
      throw new Error(error);
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
    validate: [validator.isEmail, 'E-mail inv??lido.']
  },
  phone: {
    type: String,
    unique: [true, 'Telefone j?? cadastrado.'],
    trim: true,
    required: [true, 'Insira um n??mero.']
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
    senderName: {
      type: String,
      required: true
    },
    senderEmail: {
      type: String,
      trim: true,
      required: true
    },
    senderPhone: {
      type: String,
      trim: true,
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