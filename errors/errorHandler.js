const { SERVER_ERROR } = require('../utils/constants');

module.exports.errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
};
