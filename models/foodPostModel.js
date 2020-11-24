'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllFoodPosts = async () => {
  try {
    const [rows] = await promisePool
    .execute(`SELECT cat_id, wop_cat.name, age, weight, owner, filename, user_id, coords, wop_user.name
                  AS ownername FROM wop_cat LEFT JOIN wop_user ON owner = user_id`);
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
    .execute(`SELECT cat_id, wop_cat.name, age, weight, owner, filename, user_id, wop_user.name
                  AS ownername FROM wop_cat LEFT JOIN wop_user ON owner = user_id WHERE cat_id = ?`, [id]);
    return rows[0];
  }
  catch (e) {
    console.error('foodPostModel:', e.message);
  }
};

const insertFoodPost = async (req, coords) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_cat (name, age, weight, owner, filename, coords) VALUES (?, ?, ?, ?, ?, ?);',
        [
          req.body.user,
          req.body.title,
          req.body.text,
          req.file.filename,
          req.body.coords,
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
        'UPDATE wop_cat SET name = ?, age = ?, weight = ? WHERE cat_id = ?;',
        [
          req.body.title,
          req.body.text,
          req.body.id]);
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
        'DELETE FROM wop_cat WHERE cat_id = ?;', [id]);
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
  deleteFoodPost
};