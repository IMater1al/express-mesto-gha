const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  SERVER_ERROR, NOT_FOUND, BAD_REQUEST, CREATED, NOT_AUTHORIZED,
} = require('../utils/constants');
const { getJwtToken } = require('../utils/jwt');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла Ошибка' }));
};

module.exports.getUser = async (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user) return res.send(user);
      return res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Введите валидный _id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла Ошибка' });
    });
};

module.exports.getCurrentUser = (req, res) => {
  const currentUserId = req.user._id;
  User.findById(currentUserId)
    .then((user) => {
      if (user) return res.send(user);
      return res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Введите валидный _id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла Ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла Ошибка' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) return res.send(user);
      return res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Введите валидный _id' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла Ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) return res.send(user);
      return res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Введите валидный _id' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла Ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password).then((user) => {
    const token = getJwtToken({ _id: user._id });

    res.cookie('jwt', token, {
      maxAge: 604800,
      httpOnly: true,
      sameSite: true,
    });

    res.send({ token });
  })
    .catch((err) => res.status(NOT_AUTHORIZED).send({ message: err.message }));
};
