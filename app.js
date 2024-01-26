const express = require('express');
const mongoose = require('mongoose');
const { default: helmet } = require('helmet');
const { default: rateLimit } = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { errorHandler } = require('./errors/errorHandler');

require('dotenv').config(); // насчет файла конфигурации у меня просто .env файл имеется, откуда переменные подтягиваются. Вы это имели в виду? Или как то по другому лучше?

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

app.use('/', require('./routes/index'));

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
