'use strict';

const express = require('express');
const {body} = require('express-validator');
const multer = require('multer');
const ratingController = require('../controllers/ratingController');
const router = express.Router();
const passport = require('../utils/pass');

// prevent multer from saving wrong file types
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.includes('image')) {
    return cb(null, false, new Error('not an image'));
  } else {
    cb(null, true);
  }
};

const upload = multer({dest: 'uploads/', fileFilter});

const injectFile = (req, res, next) => {
  if (req.file) {
    req.body.type = req.file.mimetype;
  }
  console.log('inject', req.body);
  next();
};

router.get('/', ratingController.rating_list_get);
router.post('/',
    passport.authenticate('jwt', {session: false}),
    upload.single('rating'),
    injectFile,
    [
      body('likes', 'required').isLength({min: 1}).isNumeric(),
      body('dislikes', 'required').isLength({min: 1}).isNumeric(),
    ],
    ratingController.ratingPost_create);

router.get('/:id', ratingController.ratingPost_get_by_id);
router.put('/',
    passport.authenticate('jwt', {session: false}),
    [
      body('likes', 'cannot be empty').isNumeric,
      body('dislikes', 'cannot be empty').isNumeric,
    ],
    ratingController.rating_update);

router.delete('/:id',
    passport.authenticate('jwt', {session: false}),
    ratingController.ratingPost_delete);

module.exports = router;