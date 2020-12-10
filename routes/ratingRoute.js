'use strict';

const express = require('express');
const {body} = require('express-validator');
const ratingController = require('../controllers/ratingController');
const router = express.Router();
const passport = require('../utils/pass');

router.get('/', ratingController.rating_list_get);
router.post('/',
    passport.authenticate('jwt', {session: false}),
    [
      body('likes', 'required').isLength({min: 1}).isNumeric(),
      body('dislikes', 'required').isLength({min: 1}).isNumeric(),
    ],
    ratingController.ratingPost_create);

router.get('/:id', ratingController.ratingPost_get_by_id);
router.get('/top/:top', ratingController.topRated_list_get);
router.put('/',
    passport.authenticate('jwt', {session: false}),
    [
      body('likes', 'cannot be empty').isNumeric(),
      body('dislikes', 'cannot be empty').isNumeric(),
    ],
    ratingController.rating_update);

router.delete('/:id',
    passport.authenticate('jwt', {session: false}),
    ratingController.ratingPost_delete);

module.exports = router;