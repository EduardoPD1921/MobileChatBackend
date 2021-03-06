const mongoose = require('mongoose');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const db = mongoose.createConnection(process.env.MONGODB_URI);
db.model('User', require('../models/user'));
db.model('Chat', require('../models/chat'));

module.exports = db;