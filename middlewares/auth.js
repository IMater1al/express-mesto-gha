const UnauthorizedError = require('../errors/UnauthorizedError');
const { verifyJwtToken } = require('../utils/jwt');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next(new UnauthorizedError('Необходима авторизация'));

  const decodedUser = verifyJwtToken(token);
  if (!decodedUser) return next(new UnauthorizedError('Необходима авторизация'));

  req.user = decodedUser;
  return next();
};
