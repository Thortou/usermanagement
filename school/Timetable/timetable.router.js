const express = require('express');

const router = express.Router();
const controller = require('./timetable.controller');

router.post('/create', controller.insert);
router.get('/', controller.findAll); 
router.get('/:TimetableId', controller.findOne);
router.put('/update', controller.update);
router.delete('/delete/:TimetableId', controller.dele);
router.get('/getSubject/:ClassroomId', controller.sl_cr_gradeOnly);
router.get('/getClassroom/:ClassroomId', controller.findAll_Classroom_Only);

module.exports = router;