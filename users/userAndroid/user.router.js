const express = require('express');
const router = express.Router();

const controller = require('./user.controller');

router.post('/create', controller.create);
module.exports = router;