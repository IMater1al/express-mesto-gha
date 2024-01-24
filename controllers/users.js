const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { BAD_REQUEST, CREATED } = require('../utils/constants');
const { getJwtToken } = require('../utils/jwt');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const { SALT_ROUNDS = 10 } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(new ServerError('Произошла ошибка сервера')));
};

module.exports.getUser = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user) return res.send(user);
      return next(new NotFoundError('Пользователь по указанному _id не найден'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Введите валидный _id' });
      }
      return next(new ServerError('Произошла ошибка сервера'));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const currentUserId = req.user._id;
  User.findById(currentUserId)
    .then((user) => res.send(user))
    .catch(() => next(new ServerError('Произошла ошибка сервера')));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) return next(new ConflictError('Такой пользователь уже существует'));

    return bcrypt.hash(password, SALT_ROUNDS)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((newUser) => res.status(CREATED).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      }));
  })
    .catch((err) => next(new ServerError(err.message)));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch(() => next(new ServerError('Произошла ошибка сервера')));
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch(() => next(new ServerError('Произошла ошибка сервера')));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password).then((user) => {
    const token = getJwtToken({ _id: user._id });

    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней жизнь куков
      httpOnly: true,
      sameSite: true,
    });

    res.send({ token });
  })
    .catch((err) => next(new UnauthorizedError(err.message)));
};
