'use strict';

const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/register',
    [
      body('username', 'minimum length 3 characters').isLength({min: 3}),
      body('email', 'is not valid email').isEmail(),
      body('password', 'minimum length 3 characters').isLength({min: 3}),
    ],
    authController.user_create_post,
    authController.login,
);

module.exports = router;