const express = require('express');
const router = express.Router();
const controller = require('./move-out.controller');

router.post('/create', controller.move_out);
router.get('/', controller.findAll);

module.exports = router;