const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET = 'SECRET-KEY' } = process.env;

const getJwtToken = (payload) => jwt.sign(payload, JWT_SECRET, {
  expiresIn: '7d',
});

const verifyJwtToken = (token) => jwt.verify(token, JWT_SECRET, (err, decoded) => {
  if (err) return Promise.reject(new UnauthorizedError('Необходима авторизация'));

  return Promise.resolve(decoded); // решил тут через промисы обрабатывать, надеюсь не ошибка
});

module.exports = {
  getJwtToken,
  verifyJwtToken,
};
