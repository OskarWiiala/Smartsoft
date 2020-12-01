'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllFoodPosts = async () => {
  try {
    const [rows] = await promisePool
    .execute(`SELECT food_post_id, user, title, text, filename, user_id, username
                  FROM ss_food_post LEFT JOIN ss_user ON user = user_id`);
    return rows;
  }
  catch (e) {
    console.error('foodPostModel:', e.message);
  }
};

const getFoodPost = async (id) => {
  try {
    console.log('foodPostModel getFoodPost', id);
    const [rows] = await promisePool
    .execute(`SELECT food_post_id, user, title, text, filename, user_id, username
                  FROM ss_food_post LEFT JOIN ss_user ON user = user_id WHERE food_post_id = ?`, [id]);
    return rows[0];
  }
  catch (e) {
    console.error('foodPostModel:', e.message);
  }
};

const getFoodPostLike = async (id) => {
  try {
    console.log('foodPostModel getFoodPostLike', id);
    const [rows] = await promisePool
    .execute(`SELECT id, fk_food_post_id, likes, dislikes
                  FROM ss_rating LEFT JOIN ss_food_post ON post = food_post_id WHERE fk_food_post_id = ?`, [id]);
    return rows[0];
  }
  catch (e) {
    console.error('foodPostModel:', e.message);
  }
};

const insertFoodPost = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO ss_food_post (user, title, text, filename) VALUES (?, ?, ?, ?);',
        [
          req.body.user,
          req.body.title,
          req.body.text,
          req.file.filename,
        ]);
    console.log('foodPostModel insert:', rows);
    return rows.insertId;
  }
  catch (e) {
    console.error('foodPostModel insertFoodPost:', e);
    return 0;
  }
};

const updateFoodPost = async (req) => {
  try {
    console.log(req.body);
    const [rows] = await promisePool.execute(
        'UPDATE ss_food_post SET title = ?, text = ? WHERE food_post_id = ?;',
        [
          req.body.title,
          req.body.text,
          req.body.id
        ]);
    console.log('foodPostModel update:', rows);
    return rows.affectedRows === 1;
  }
  catch (e) {
    return false;
  }
};

const updateFoodPostLikes = async (req) => {
  try {
    console.log(req.body);
    const [rows] = await promisePool.execute(
        'UPDATE ss_rating SET likes = ?, dislikes = ? FROM ss_rating, ss_food_post WHERE ss_rating.fk_food_post_id = ss_food_post.food_post_id;',
        [
          req.body.likes,
          req.body.dislikes,
          req.body.id
        ]);
    console.log('foodPostModel likes update:', rows);
    return rows.affectedRows === 1;
  }
  catch (e) {
    return false;
  }
};

const deleteFoodPost = async (id) => {
  try {
    console.log('deleteFoodPost', id);
    const [rows] = await promisePool.execute(
        'DELETE FROM ss_food_post WHERE food_post_id = ?;', [id]);
    return rows;
  }
  catch (e) {
    console.error('foodPostModel:', e.message);
  }
};

module.exports = {
  getAllFoodPosts,
  getFoodPost,
  insertFoodPost,
  updateFoodPost,
  deleteFoodPost,
  updateFoodPostLikes,
  getFoodPostLike
};