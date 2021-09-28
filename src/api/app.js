const express = require('express');
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.get('/', (req, res, next) => {
  res.status(200).send('wroking');
});

module.exports = app;