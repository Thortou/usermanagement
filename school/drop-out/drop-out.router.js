const express = require('express');

const router = express.Router();
const controller = require('./drop-out.controller');

router.post('/create', controller.drop_school);
router.get('/', controller.findAll);
router.get('/:TermId', controller.findAllBy_TermId);
router.get('/DataDeath/select', controller.findData_Death_Students)

module.exports = router;