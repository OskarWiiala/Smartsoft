// controller for food post ratings

'use strict';

const ratingModel = require('../models/ratingModel');
const {validationResult} = require('express-validator');

const ratings = ratingModel.ratings;

const rating_list_get = async (req, res) => {
  const ratings = await ratingModel.getAllRatingPosts();
  res.json(ratings);
};

const topRated_list_get = async (req, res) => {
  const ratings = await ratingModel.getTopRatedPosts();
  res.json(ratings);
};

const ratingPost_get_by_id = async (req, res) => {
  console.log('ratingController: http get rating with path param', req.params);
  const rating = await ratingModel.getRatingPost(req.params.id);
  res.json(rating);
};

const ratingPost_create = async (req, res) => {
  console.log('ratingController ratingPost_create', req.body, req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validation', errors.array());
    return res.status(400).json({errors: errors.array()});
  }

  const id = await ratingModel.insertRatingPost(req);
  const rating = await ratingModel.getRatingPost(id);
  res.send(rating);
};

const rating_update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validation', errors.array());
    return res.status(400).json({errors: errors.array()});
  }
  const ratingUpdateOk = await ratingModel.updateRatingPost(req);
  res.json(`{message: "ratings updated... ${ratingUpdateOk}"}`);
};

const ratingPost_delete = async (req, res) => {
  console.log('ratingController: http delete rating with path param', req.params);
  const rating = await  ratingModel.deleteRatingPost(req.params.id);
  console.log('rating', rating);
  res.json(rating);
};

module.exports = {
  rating_list_get,
  rating_update,
  ratingPost_create,
  ratingPost_get_by_id,
  ratingPost_delete,
  topRated_list_get
};