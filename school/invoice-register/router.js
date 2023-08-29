const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/create', controller.insert);
router.get('/', controller.findAll);
router.get('/getgrade/:TermId', controller.getGrade);
router.get('/getInvoiceNumber', controller.getMax);
router.get('/getSum/:TermId', controller.getSum);
router.get('/select/:GradeId', controller.findAll_getGrade);
router.get('/:GradeId', controller.findAll_getGradeId);//select grade
router.get('/select/get/inDebt', controller.findAll_inDebt);
router.get('/select/inDebt/:GradeId', controller.findAll_inDebt_GradeID);
router.get('/select/getinDebt/:RegisterId', controller.findAll_inDebt_RegisterId);
router.get('/select/notId/member', controller.findAll_not_in_classroom);
router.get('/:RegisterId', controller.findOne);
router.delete('/delete/:RegisterId', controller.delet);
router.put('/update', controller.Edit);
router.put('/update/inDebt', controller.Edit_StatusPayment);
router.post('/getarray/data', controller.findAll_id)

router.get('/get/myid/getgrade/:MemberId', controller.findAll_select_grades)

module.exports = router; 