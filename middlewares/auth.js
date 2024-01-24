const { NOT_AUTHORIZED, SERVER_ERROR } = require('../utils/constants');
const { verifyJwtToken } = require('../utils/jwt');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) { return res.status(NOT_AUTHORIZED).send({ message: 'Необходима авторизация' }); }

  return verifyJwtToken(token).then((jwtPayload) => {
    req.user = jwtPayload;
    next();
  }).catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports = { auth };
