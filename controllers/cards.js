const Card = require('../models/card');
const {
  SERVER_ERROR, NOT_FOUND, BAD_REQUEST, CREATED,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла Ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла Ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send(card);
      return res
        .status(NOT_FOUND)
        .send({ message: 'Карточка по указанному _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Введите валидный _id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла Ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send(card);
      return res
        .status(NOT_FOUND)
        .send({ message: 'Карточка по указанному _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Введите валидный _id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла Ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card) return res.send(card);
      return res
        .status(NOT_FOUND)
        .send({ message: 'Карточка по указанному _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Введите валидный _id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла Ошибка' });
    });
};
