const express = require('express');

const router = express.Router();
const controller = require('./regulation.controller');

router.post('/create', controller.create);
router.get('/', controller.findAll);
router.get('/select', controller.findRegName);
router.get('/:RegId', controller.findOne);
router.put('/update', controller.updated);
router.delete('/delete/:RegId', controller.deleted);

module.exports = router;