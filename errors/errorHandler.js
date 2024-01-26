const { SERVER_ERROR } = require('../utils/constants');
const BadRequestError = require('./BadRequestError');
const ConflictError = require('./ConflictError');
const ForbiddenError = require('./ForbiddenError');
const NotFoundError = require('./NotFoundError');
const UnauthorizedError = require('./UnauthorizedError');

module.exports.errorHandler = (err, req, res, next) => {
  // пришлось добавить next в исключения eslint-a
  // иначе он ругался,но неиспользуемую переменную, дайте знать если есть другие идеи
  if (err instanceof ConflictError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  if (err instanceof ForbiddenError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res.status(SERVER_ERROR).send({ message: err.message });
}; // и немного не понял зачем все эти проверки на принадлежность классу.
// Может, чтобы каждую ошибку отправлять по своему клиенту? Но пока все ответы выглядят одинаково
