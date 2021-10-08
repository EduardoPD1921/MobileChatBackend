const jwt = require('jsonwebtoken');
// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = class JwtService {
  static generateToken(data) {
    const token = jwt.sign(data, process.env.JWT_PRIVATE_KEY);
    return token;
  }
};