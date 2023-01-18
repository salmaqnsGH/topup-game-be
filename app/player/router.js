var express = require('express');
var router = express.Router();
const { landingPage, detailPage } = require('./controller')

router.get('/landingPage', landingPage);
router.get('/:id/detail', detailPage);

module.exports = router;
