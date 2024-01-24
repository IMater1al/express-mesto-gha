const express = require('express');
const mongoose = require('mongoose');
const { default: helmet } = require('helmet');
const { default: rateLimit } = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { NOT_FOUND } = require('./utils/constants');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

require('dotenv').config();

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mydb' } = process.env;

mongoose.connect(MONGO_URL);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const app = express();

app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(cookieParser());

app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('/*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Такого пути не существует' });
});

app.listen(PORT);
