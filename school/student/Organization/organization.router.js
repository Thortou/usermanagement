const express = require('express');
const router = express.Router();
const controller = require('./organization.controller');

router.post('/create', controller.create);
router.get('/', controller.findAll);
router.get('/:MassOrgId', controller.findOne); 
router.put('/update', controller.updated);
router.get('/getDataForRoom/:ClassroomId', controller.getDataForRoom) 
router.get('/select/all', controller. findAll_women_plus_youth) 
router.get('/select/getRoomName/:ClassroomId', controller. findAll_Organization) 


module.exports = router;