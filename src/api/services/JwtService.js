const jwt = require('jsonwebtoken');
// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = class JwtService {
  static generateToken(data) {
    const token = jwt.sign(data, process.env.JWT_PRIVATE_KEY);
    return token;
  }

  static verifyToken(token) {
    try {
      const verify = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      return verify;
    } catch (error) {
      throw new Error('invalid-token');
    }
  }

  static decodeToken(token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      return decodedToken;
    } catch (error) {
      throw new Error('invalid-token');
    }
  }
};