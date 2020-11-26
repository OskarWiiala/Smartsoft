'use strict';

const express = require('express');
const {body} = require('express-validator');
const multer = require('multer');
const foodPostController = require('../controllers/foodPostController');
const router = express.Router();

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

router.get('/', foodPostController.foodPost_list_get);
router.post('/',
    upload.single('foodPost'),
    foodPostController.make_thumbnail,
    injectFile,
    [
      body('user', 'required').isLength({min: 1}).isNumeric(),
      body('title', 'cannot be empty').isLength({min: 1}),
      body('text', 'cannot be empty').isLength({min: 1}),
      body('image', 'not an image').contains('image'),
    ],
    foodPostController.foodPost_create);

router.get('/:id', foodPostController.foodPost_get_by_id);
router.put('/',
    [
      body('title', 'cannot be empty').isLength({min: 1}),
      body('text', 'cannot be empty').isLength({min: 1}),
    ],
    foodPostController.foodPost_update);
router.delete('/:id', foodPostController.foodPost_delete);

module.exports = router;