const UnauthorizedError = require('../errors/UnauthorizedError');
const { verifyJwtToken } = require('../utils/jwt');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next(new UnauthorizedError('Необходима авторизация'));

  return verifyJwtToken(token).then((decoded) => {
    req.user = decoded;
    return next();
  }).catch((err) => next(err));
};
