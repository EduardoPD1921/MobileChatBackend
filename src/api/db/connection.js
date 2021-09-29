const mongoose = require('mongoose');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const conn = mongoose.createConnection(process.env.MONGODB_URI);
conn.model('User', require('../models/user'));

module.exports = conn;