// route for food posts' ratings

'use strict';

const express = require('express');
const {body} = require('express-validator');
const multer = require('multer');
const ratingController = require('../controllers/ratingController');
const router = express.Router();
const passport = require('../utils/pass');

// these (fileFilter and multer) are redundant, but the post method doesn't work
// without them because of how the form is sent from the front-end
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.includes('image')) {
    return cb(null, false, new Error('not an image'));
  } else {
    cb(null, true);
  }
};

const upload = multer({dest: 'uploads/', fileFilter});

router.get('/', ratingController.rating_list_get);
router.post('/',
    // post method requires authentication
    passport.authenticate('jwt', {session: false}),
    upload.single('rating'),
    [
      // the fields are validated not to be empty
      body('likes', 'cannot be empty').isLength({min: 1}).isNumeric(),
      body('dislikes', 'cannot be empty').isLength({min: 1}).isNumeric(),
    ],
    ratingController.ratingPost_create);

router.get('/:id', ratingController.ratingPost_get_by_id);
router.get('/top/:top', ratingController.topRated_list_get);
router.put('/',
    // put method requires authentication
    passport.authenticate('jwt', {session: false}),
    [
      // the fields are validated not to be empty
      body('likes', 'cannot be empty').isLength({min: 1}).isNumeric(),
      body('dislikes', 'cannot be empty').isLength({min: 1}).isNumeric(),
    ],
    ratingController.rating_update);

router.delete('/:id',
    // delete method requires authentication
    passport.authenticate('jwt', {session: false}),
    ratingController.ratingPost_delete);

module.exports = router;