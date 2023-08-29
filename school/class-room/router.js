const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/create', controller.insert);
router.get('/', controller.findAll);
router.get('/:ClassroomId', controller.findOne);
router.delete('/delete/:ClassroomId', controller.delete);
router.put('/update', controller.Edit);

//get classroom of teacher only
router.get('/getclassroom/:UserId',controller.findAll_get_classroomOnly);
router.get('/getsubject/:UserId',controller.findAll_get_Teacher);

module.exports = router;  