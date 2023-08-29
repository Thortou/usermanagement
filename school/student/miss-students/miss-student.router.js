const express = require('express');
const router = express.Router();
const controller = require('./miss-student.controller');

router.post('/create', controller.insertMissDay);
router.get('/:UserId', controller.Teacherroom_only)
router.get('/miss_class/:ClassroomId/:Month', controller.Teacherroom_by_miss)
router.get('/miss/class', controller.Teacherroom_by_missall)

module.exports = router;