'use strict';

const foodPostModel = require('../models/foodPostModel');
const {validationResult} = require('express-validator');
const {makeThumbnail} = require('../utils/resize');

const foodPosts = foodPostModel.foodPosts;

const foodPost_list_get = async (req, res) => {
  const foodPosts = await foodPostModel.getAllFoodPosts();
  res.json(foodPosts);
};

const foodPost_get_by_id = async (req, res) => {
  console.log('foodPostController: http get foodPost with path param', req.params);
  const foodPost = await foodPostModel.getFoodPost(req.params.id);
  res.json(foodPost);
};

const make_thumbnail = async(req, res, next) => {
  try {
    const ready = await makeThumbnail({width: 260, height: 160}, req.file.path,
        './thumbnails/' + req.file.filename);
    if (ready) {
      console.log('make_thumbnail', ready);
      next();
    }
  } catch (e) {
    next();
  }
};

const foodPost_create = async (req, res) => {
  console.log('foodPostController foodPost_create', req.body, req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validation', errors.array());
    return res.status(400).json({errors: errors.array()});
  }

  const id = await foodPostModel.insertFoodPost(req);
  const foodPost = await foodPostModel.getFoodPost(id);
  res.send(foodPost);
};


const foodPost_update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validation', errors.array());
    return res.status(400).json({errors: errors.array()});
  }
  const updateOk = await foodPostModel.updateFoodPost(req);
  res.json(`{message: "updated... ${updateOk}"}`);
};

const foodPost_delete = async (req, res) => {
  console.log('foodPostController: http delete foodPost with path param', req.params);
  const foodPost = await  foodPostModel.deleteFoodPost(req.params.id);
  console.log('Food post', foodPost);
  res.json(foodPost);
};

module.exports = {
  foodPost_list_get,
  foodPost_get_by_id,
  foodPost_create,
  foodPost_update,
  foodPost_delete,
  make_thumbnail,
};