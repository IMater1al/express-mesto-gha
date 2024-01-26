const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { signUpValidation, signInValidation } = require('../utils/validationRules');

router.post('/signup', signUpValidation, createUser);
router.post('/signin', signInValidation, login);
router.use(auth);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.all('/*', (req, res, next) => {
  next(new NotFoundError('Такого пути не существует'));
});

module.exports = router;
