var express = require('express');
var router = express.Router();
const { landingPage, detailPage, category, checkout, history, historyDetail } = require('./controller')
const { isLoginPlayer } = require('../middlewares/auth')

router.get('/landingPage', landingPage);
router.get('/:id/detail', detailPage);
router.get('/category', category);
router.post('/checkout', isLoginPlayer, checkout);
router.get('/history', isLoginPlayer, history);
router.get('/history/:id/detail', isLoginPlayer, historyDetail);

module.exports = router;
