const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '658f4b3b2bd031cdb52f71e3',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('/*', (req, res) => {
  res.status(404).send({ message: 'Такого пути не существует' });
});

app.listen(PORT, () => {
  console.log(`Express app Listening on port ${PORT}`);
});
