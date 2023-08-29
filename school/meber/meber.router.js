const express = require('express');

const router = express.Router();
const controller = require('./meber.controller');

router.post('/create', controller.create);
router.get('/', controller.findAll);
router.get('/getmember/:ClassroomId', controller.findAll_getmember);
router.get('/getmemberall/:UserId', controller.findAll_getmemberall);


router.get('/getmemberid/:MemberId', controller.findAll_getmemberId);
router.delete('/delete', controller.delet);
router.get('/dd', controller.demoSl);

//Count student by classroom
router.get('/GradeOne', controller.GradeOne);
router.get('/GradeTwo', controller.GradeTwo);
router.get('/GradeThree', controller.GradeThree);
router.get('/GradeFour', controller.GradeFour);
router.get('/GradeFive', controller.GradeFive);
router.get('/GradeSix', controller.GradeSix);
router.get('/GradeSeven', controller.GradeSeven);
router.get('/CountTransferIn', controller.countTansferIn);

//Get data by Classroom

router.get('/getdata/:GradeName', controller.get_in_info_GradeOne);
router.get('/getgender/:Gender', controller.findAllByFemale);
router.get('/TransferIn', controller.TansferIn);


module.exports = router;