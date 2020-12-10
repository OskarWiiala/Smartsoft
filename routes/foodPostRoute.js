// route for food posts

'use strict';

const express = require('express');
const {body} = require('express-validator');
const multer = require('multer');
const foodPostController = require('../controllers/foodPostController');
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

// multer uploads images to the uploads folder
const upload = multer({dest: 'uploads/', fileFilter});

// the file added is injected if it's an image file
const injectFile = (req, res, next) => {
  if (req.file) {
    req.body.type = req.file.mimetype;
  }
  console.log('inject', req.body);
  next();
};

router.get('/', foodPostController.foodPost_list_get);
router.post('/',
    // post method requires authentication
    passport.authenticate('jwt', {session: false}),
    upload.single('foodPost'),
    foodPostController.make_thumbnail,
    injectFile,
    [
      // the fields are validated not to be empty
      body('user', 'required').isLength({min: 1}).isNumeric(),
      body('title', 'cannot be empty').isLength({min: 1}),
      body('text', 'cannot be empty').isLength({min: 1}),
      body('status', 'cannot be empty').isLength({min: 1}),
      body('type', 'not an image').contains('image'),
    ],
    foodPostController.foodPost_create);

router.get('/:id', foodPostController.foodPost_get_by_id);
router.get('/title/:title', foodPostController.foodPost_get_by_title);
router.get('/username/:username', foodPostController.foodPost_get_by_username);
router.get('/email/:email', foodPostController.foodPost_get_by_email);
router.put('/',
    // put method requires authentication
    passport.authenticate('jwt', {session: false}),
    [
      // the fields are validated not to be empty
      body('title', 'cannot be empty').isLength({min: 1}),
      body('text', 'cannot be empty').isLength({min: 1}),
      body('status', 'cannot be empty').isLength({min: 1}),
    ],
    foodPostController.foodPost_update);

router.delete('/:id',
    // delete method requires authentication
    passport.authenticate('jwt', {session: false}),
    foodPostController.foodPost_delete);

module.exports = router;