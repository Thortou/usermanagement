const express = require('express');

const router = express.Router();
const controller = require('./student-point.controller');

router.post('/create',controller.create);
router.get('/',controller.findAll);
router.get('/:PointId',controller.findOne);

module.exports = router;