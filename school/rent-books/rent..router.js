const express = require('express')
const router = express.Router();
const controller = require('./rent.controller')

router.post('/create', controller.rentbooks);
router.get('/', controller.findAll)
router.get('/:RentbId', controller.findOne)
router.get('/select/Max', controller.findOne_by_maxId)
router.get('/select/prices', controller.total_money)
router.get('/getgrade/:GradeId', controller.findall_by_gradeId)
router.get('/getrentnumber/:RentNumber', controller.findOne_RentNumber)
router.delete('/sendbook/:RentNumber', controller.deleted)

module.exports = router;