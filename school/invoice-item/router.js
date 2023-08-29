const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/create', controller.insert);
router.get('/', controller.findAll);
router.get('/getSum', controller.getSum);
router.get('/:ItemId', controller.findOne);
router.get('/getgrade/:TermId', controller.getGradeId);
router.delete('/delete/:ItemId', controller.delet); 
router.put('/update', controller.Edit);

module.exports = router; 