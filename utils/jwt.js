const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET = 'SECRET-KEY' } = process.env;

const getJwtToken = (payload) => jwt.sign(payload, JWT_SECRET, {
  expiresIn: '7d',
});

const verifyJwtToken = (token) => jwt.verify(token, JWT_SECRET, (err, decoded) => {
  if (err) return false;

  return User.findById(decoded._id).then(() => decoded).catch(() => false);
});

module.exports = {
  getJwtToken,
  verifyJwtToken,
};
