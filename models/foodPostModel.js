'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllFoodPosts = async () => {
  try {
    const [rows] = await promisePool
    .execute(`SELECT food_post_id, user, title, text, filename, ss_food_post.status, user_id, username, likes, dislikes
                  FROM ss_food_post
                  LEFT JOIN ss_user ON user = user_id
                  LEFT JOIN ss_rating ON food_post_id = fk_food_post_id;`);
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
    .execute(`SELECT food_post_id, user, title, text, filename, ss_food_post.status, user_id, username
                  FROM ss_food_post LEFT JOIN ss_user ON user = user_id WHERE food_post_id = ?`, [id]);
    return rows[0];
  }
  catch (e) {
    console.error('foodPostModel:', e.message);
  }
};

const getFoodPostTitle = async (title) => {
  try {
    console.log('foodPostModel getFoodPostTitle', title);
    const query = `SELECT food_post_id, user, title, text, filename, ss_food_post.status, user_id, username, likes, dislikes
                  FROM ss_food_post
                  LEFT JOIN ss_rating ON food_post_id = fk_food_post_id
                  LEFT JOIN ss_user ON user = user_id WHERE LOWER(title) LIKE LOWER('%${title}%')`;
    const [rows] = await promisePool.execute(query);
    return rows;
  }
  catch (e) {
    console.error('foodPostModel:', e.message);
  }
};

const getFoodPostUsername = async (username) => {
  try {
    console.log('foodPostModel getFoodPostUsername', username);
    const query = `SELECT food_post_id, user, title, text, filename, ss_food_post.status, user_id, username, likes, dislikes
                  FROM ss_food_post
                  LEFT JOIN ss_rating ON food_post_id = fk_food_post_id
                  LEFT JOIN ss_user ON user = user_id WHERE LOWER(username) LIKE LOWER('%${username}%')`;
    const [rows] = await promisePool.execute(query);
    return rows;
  }
  catch (e) {
    console.error('foodPostModel:', e.message);
  }
};

const insertFoodPost = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO ss_food_post (user, title, text, filename, status) VALUES (?, ?, ?, ?, ?);',
        [
          req.body.user,
          req.body.title,
          req.body.text,
          req.file.filename,
          req.body.status,
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
        'UPDATE ss_food_post SET title = ?, text = ?, status = ? WHERE food_post_id = ?;',
        [
          req.body.title,
          req.body.text,
          req.body.status,
          req.body.id
        ]);
    console.log('foodPostModel update:', rows);
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
  getFoodPostTitle,
  getFoodPostUsername,
};