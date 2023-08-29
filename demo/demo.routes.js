const express = require('express');
const router = express.Router();
const controller = require('./demo.controller');

router.post('/create', controller.insert); 
router.post('/newCreate', controller.newInsert);
router.get('/', controller.findAll);
router.post('/delete', controller.delet);
router.post('/insert', controller.insert_demo);
router.post('/selectDemo', controller.demos);

module.exports = router; 