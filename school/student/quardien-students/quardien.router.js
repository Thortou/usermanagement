const express = require('express');
const router = express.Router();
const controller = require('./quardien.controller');

router.get('/', controller.findall);
router.get('/select/:ParentId', controller.findOne);
router.put('/update', controller.update);

module.exports= router;