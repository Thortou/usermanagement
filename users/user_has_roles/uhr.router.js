const express = require('express');
const router = express.Router();
const controller = require('./uhr.controller');

router.post('/create', controller.getrole);
router.post('/insert', controller.create);
router.get('/', controller.findeAll);
router.get('/:UserId', controller.findeOne);
router.put('/update', controller.update);
router.delete('/delete/:UserhRoleId', controller.deleted);
router.post('/TeacherHsubject',controller.creasteGet_subject);
router.delete('/TeacherHsubject/delete/:TeacherHsubId', controller.delete_teacherhsubject);
router.post('/Teacherroom/create', controller.Teacherroom);
router.get('/Teacherroom/:UserId',controller.getTeacherroom);
router.get('/subject/:UserId', controller.getSubject);
router.get('/select/teacherroom/teacherhsubject', controller.findeTeacherRoom_TeacherHsubject_roles)
router.get('/selectteacher/getgrade/:GradeId', controller.findeAllGetGrade)

module.exports = router