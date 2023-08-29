const express = require('express');

const router = express.Router();
const controller = require('./deduct.controller');

router.post('/create', controller.create);
router.get('/',controller.findAll);
router.get('/:DeductId',controller.findOne); 
router.put('/update', controller.updated);
router.delete('/delete/:DeductId', controller.deleted);

module.exports = router;