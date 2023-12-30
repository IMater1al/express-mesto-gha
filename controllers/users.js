const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user) return res.send(user);
      return res
        .status(404)
        .send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError')
        return res.status(400).send({ message: 'Введите валидный _id' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError')
        return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
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
        .status(404)
        .send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError')
        return res.status(400).send({ message: 'Введите валидный _id' });
      if (err.name === 'ValidationError')
        return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
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
        .status(404)
        .send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError')
        return res.status(400).send({ message: 'Введите валидный _id' });
      if (err.name === 'ValidationError')
        return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
    });
};
