var express = require('express');
var router = express.Router();
const { landingPage } = require('./controller')

router.get('/landingPage', landingPage);

module.exports = router;
