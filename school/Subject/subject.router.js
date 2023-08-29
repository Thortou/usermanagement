const express = require('express');
const router = express.Router();
const controller = require('./subject.controller');

router.post('/create', controller.insert);
router.get('/', controller.findAll);
router.get('/getSubjectid/:SubjectId', controller.findOne);
router.get('/:GradeId', controller.findAll_get_Grade);
router.put('/update', controller.update);
router.delete('/delete/:SubjectId', controller.dele);

module.exports = router;