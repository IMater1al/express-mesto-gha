const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError')
        return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
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
        .status(404)
        .send({ message: 'Карточка по указанному _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError')
        return res.status(400).send({ message: 'Введите валидный _id' });
      return res.status(500).send({ message: err.message });
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
        .status(404)
        .send({ message: 'Карточка по указанному _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError')
        return res.status(400).send({ message: 'Введите валидный _id' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card) return res.send(card);
      return res
        .status(404)
        .send({ message: 'Карточка по указанному _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError')
        return res.status(400).send({ message: 'Введите валидный _id' });
      return res.status(500).send({ message: err.message });
    });
};
