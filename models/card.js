const mongoose = require('mongoose');

const cardSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },

    link: {
      type: String,
      validate: {
        validator: (value) => {
          const urlRegex =
            /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
          return urlRegex.test(value);
        },
        message: 'Передан некорректный Url',
      },
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, retainKeyOrder: true },
);

module.exports = mongoose.model('card', cardSchema);
