const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  if (req.param.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => res.send({ data: card }))
      .catch((err) => res.send({ message: err.message }));
  } else {
    res.send({ message: 'Неправильный id' });
  }
};

module.exports.dislikeCard = (req, res) => {
  if (req.param.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => res.send({ data: card }))
      .catch((err) => res.send({ message: err.message }));
  } else {
    res.send({ message: 'Неправильный id' });
  }
};
