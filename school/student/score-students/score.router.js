const express = require('express');
const router = express.Router();
const controller = require('./score.controller');


router.post('/create', controller.create);
router.get('/getscore/:MemberId', controller.findData);
// router.get('/:UserId', controller.findAll);
router.get('/getRoomId/:TeacherHsubId', controller.findDateByclassroomId);
router.get('/getRoomId/:ClassroomId/:UserId/:MemberId', controller.findDateByclassroomId_and_memberId);
// router.get('/demo/total', demo.findDemo);

router.get('/average/score/:Monthly',controller.findScore);
router.get('/average/score/:Monthly/:TermId/:ClassroomId',controller.findScore_termid);

module.exports = router;