const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/create', controller.insert);
router.get('/', controller.findAll);
router.get('/:TermId', controller.findOne);
router.delete('/delete/:TermId', controller.delet);

module.exports = router; 