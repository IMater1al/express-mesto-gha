const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const Card = require('../models/card');
const {
  BAD_REQUEST, CREATED,
} = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => next(new ServerError('Произошла ошибка сервера')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации' });
      }
      return next(new ServerError('Произошла ошибка сервера'));
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send(card);
      return next(new NotFoundError('Карточка по указанному _id не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Введите валидный _id'));
      return next(new ServerError('Произошла ошибка сервера'));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send(card);
      return next(new NotFoundError('Карточка по указанному _id не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Введите валидный _id'));
      return next(new ServerError('Произошла ошибка сервера'));
    });
};

module.exports.deleteCard = (req, res, next) => {
  const currentUserId = req.user._id;

  Card.findById(req.params.cardId).then((card) => {
    if (!card) return next(new NotFoundError('Карточка по указанному _id не найдена'));

    if (card.owner.toString() !== currentUserId) return next(new ForbiddenError('Нет доступа'));

    return Card.findByIdAndDelete(req.params.cardId).then((deletedCard) => res.send(deletedCard));
  }).catch((err) => {
    if (err.name === 'CastError') return next(new BadRequestError('Введите валидный _id'));

    return next(new ServerError('Произошла ошибка сервера'));
  });
};
