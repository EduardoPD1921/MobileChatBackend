const express = require('express');
const cors = require('cors');

const app = express();
const router = express.Router();

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.get('/', (req, res, next) => {
  res.status(200).send({ message: 'API v1.0' });
});
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

module.exports = app;