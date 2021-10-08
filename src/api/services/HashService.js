const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = class HashService {
  static async generateHash(rawValue) {
    const hash = await bcrypt.hash(rawValue, parseInt(process.env.ENCRIPT_SALT_ROUNDS));
    return hash;
  }

  static async compareHash(rawValue, hashValue) {
    const hashCompare = await bcrypt.compare(rawValue, hashValue);
    return hashCompare;
  }
};