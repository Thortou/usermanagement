const express = require('express');
const router = express.Router();
const controller = require('./app-student.controller');

router.get('/:UserName', controller.findAll);

module.exports = router;