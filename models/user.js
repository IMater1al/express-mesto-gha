const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },

    about: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },

    avatar: {
      type: String,
      validate: {
        validator: (value) => {
          const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
          return urlRegex.test(value);
        },
        message: 'Передан некорректный Url',
      },

      required: true,
    },
  },

  { versionKey: false, retainKeyOrder: true },
);

module.exports = mongoose.model('user', userSchema);
