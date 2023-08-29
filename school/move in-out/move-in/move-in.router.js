const express = require('express')
const router = express.Router();
const controller = require('./move-in.controller')

router.get('/', controller.findAll);

module.exports = router 