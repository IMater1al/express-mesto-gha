const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { updateUserInfoValidation, updateUserAvatarValidation, userIdValidation } = require('../utils/validationRules');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', userIdValidation, getUser);
router.patch('/me', updateUserInfoValidation, updateUserInfo);
router.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

module.exports = router;
