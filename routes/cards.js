const router = require('express').Router();
const {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');
const { cardIdValidation, createCardValidation } = require('../utils/validationRules');

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.put('/:cardId/likes', cardIdValidation, likeCard);
router.delete('/:cardId/likes', cardIdValidation, dislikeCard);
router.delete('/:cardId', cardIdValidation, deleteCard);

module.exports = router;
