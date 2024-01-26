const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'SECRET-KEY' } = process.env;

const getJwtToken = (payload) => jwt.sign(payload, JWT_SECRET, {
  expiresIn: '7d',
});

const verifyJwtToken = (token) => jwt.verify(token, JWT_SECRET, (err, decoded) => {
  if (err) return false;
  return decoded;
});

module.exports = {
  getJwtToken,
  verifyJwtToken,
};
