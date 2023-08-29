const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/create', controller.insert);
router.get('/', controller.findAll);
router.get('/:GradeId', controller.findOne);
router.delete('/delete/:GradeId', controller.delet);
router.put('/update',controller.Edit)
router.get('/getroom/:GradeId', controller.getRoom);

module.exports = router; 