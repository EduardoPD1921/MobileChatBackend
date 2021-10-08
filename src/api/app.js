const express = require('express');
const cors = require('cors');

const app = express();
const router = express.Router();

const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.use('/', (req, res, next) => {
  res.status(200).send({ message: 'API v1.0' });
});
app.use('/user', userRoutes);

module.exports = app;