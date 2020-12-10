// model for users

'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM ss_user');
    return rows;
  }
  catch (e) {
    console.error('userModel:', e.message);
  }
};

const getUser = async (id) => {
  try {
    console.log('userModel getUser', id);
    const [rows] = await promisePool.execute(
        'SELECT * FROM ss_user WHERE user_id = ?', [id]);
    return rows[0];
  }
  catch (e) {
    console.error('userModel:', e.message);
  }
};

const insertUser = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO ss_user (username, email, password) VALUES (?, ?, ?);',
        [req.body.username, req.body.email, req.body.password]);
    console.log('userModel insert:', rows);
    return rows.insertId;
  }
  catch (e) {
    console.error('userModel insertUser:', e);
    return 0;
  }
};

const updateUser = async (id, req) => {
  try {
    const [rows] = await promisePool.execute(
        'UPDATE ss_user SET username = ?, email = ?, password = ? WHERE user_id = ?;',
        [req.body.username, req.body.email, req.body.password, id]);
    console.log('userModel update:', rows);
    return rows.affectedRows === 1;
  }
  catch (e) {
    return false;
  }
};

const getUserLogin = async (params) => {
  try {
    console.log('getUserLogin', params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM ss_user WHERE email = ?;',
        params);
    return rows;
  }
  catch (e) {
    console.log('error', e.message);
  }
};

const deleteUser = async (id) => {
  try {
    const [rows] = await promisePool.execute(
        'DELETE FROM ss_user WHERE user_id = ?;', [id]);
    console.log('userModel delete:', rows);
    return rows;
  }
  catch (e) {
    console.error('userModel deleteUser:', e.message);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  insertUser,
  updateUser,
  getUserLogin,
  deleteUser
};