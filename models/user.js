const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Жак-Ив Кусто',
    },

    about: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Исследователь',
    },

    avatar: {
      type: String,
      validate: {
        validator: (value) => validator.isURL(value),
        message: 'Передан некорректный Url',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },

    email: {
      type: String,
      required: true,
      validator: {
        validate: (value) => validator.isEmail(value),
        message: 'Передан некорректный Email',
      },
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

  },

  { versionKey: false, retainKeyOrder: true },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) return Promise.reject(new UnauthorizedError('Неправильные имя пользователя или пароль'));

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) return Promise.reject(new UnauthorizedError('Неправильные имя пользователя или пароль'));

      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
