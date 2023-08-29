const express = require('express');
const router = express.Router();
const controller = require('./youth.controller');

router.post('/create', controller.create);
router.get('/', controller.findAll);
router.get('/:MassOrgId', controller.findOne);
router.put('/update', controller.updated);
router.get('/getDataForRoom/:ClassroomId', controller.getDataForRoom) 


module.exports = router;