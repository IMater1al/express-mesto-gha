const express = require('express');
const mongoose = require('mongoose');
const { default: helmet } = require('helmet');

const { default: rateLimit } = require('express-rate-limit');
const { NOT_FOUND } = require('./utils/constants');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use((req, res, next) => {
  req.user = {
    _id: '658f4b3b2bd031cdb52f71e3',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('/*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Такого пути не существует' });
});

app.listen(PORT);
