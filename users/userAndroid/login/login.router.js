const express = require('express');

const router = express.Router();
const controller = require('./login.controller');

router.post('/login', controller.loginFluter);

module.exports= router;