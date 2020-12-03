'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllRatingPosts = async () => {
  try {
    const [rows] = await promisePool
    .execute(`SELECT id, fk_food_post_id, likes, dislikes
                  FROM ss_food_post;`);
    return rows;
  }
  catch (e) {
    console.error('ratingModel:', e.message);
  }
};

const getRatingPost = async (id) => {
  try {
    console.log('ratingModel getRatingPost', id);
    const [rows] = await promisePool
    .execute(`SELECT id, fk_food_post_id, likes, dislikes
                  FROM ss_rating WHERE fk_food_post_id = ?`, [id]);
    return rows[0];
  }
  catch (e) {
    console.error('ratingModel:', e.message);
  }
};

const insertRatingPost = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO ss_rating (fk_food_post_id, likes, dislikes) VALUES (?, ?, ?);',
        [
          req.body.fk_food_post_id,
          req.body.likes,
          req.body.dislikes
        ]);
    console.log('ratingModel insert:', rows);
    return rows.insertId;
  }
  catch (e) {
    console.error('ratingModel insertRatingPost:', e);
    return 0;
  }
};

const updateRatingPost = async (req) => {
  try {
    console.log(req.body);
    const [rows] = await promisePool.execute(
        'UPDATE ss_rating SET likes = ?, dislikes = ? WHERE fk_food_post_id = ?;',
        [
          req.body.likes,
          req.body.dislikes,
          req.body.id
        ]);
    console.log('ratingModel update:', rows);
    return rows.affectedRows === 1;
  }
  catch (e) {
    return false;
  }
};

const deleteRatingPost = async (id) => {
  try {
    console.log('deleteRatingPost', id);
    const [rows] = await promisePool.execute(
        'DELETE FROM ss_rating WHERE fk_food_post_id = ?;', [id]);
    return rows;
  }
  catch (e) {
    console.error('ratingModel:', e.message);
  }
};

module.exports = {
  getAllRatingPosts,
  updateRatingPost,
  insertRatingPost,
  deleteRatingPost,
  getRatingPost
};