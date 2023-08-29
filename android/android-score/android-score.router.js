const express = require('express');

const router = express.Router();
const controller = require('./android-score.controller');

router.get('/:UserName/:GradeName/:Monthly', controller.findAll);
router.get('/getFirstScore/:UserName', controller.findOne);
router.get('/getGrade/:UserName', controller.findGrade);


module.exports = router;