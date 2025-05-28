const config = require('./config');
const mysql = require('mysql');

const connect = mysql.createConnection(config);

const connectQuery = (sql, params) => {
  return new Promise((resolve, reject) => {
    connect.query(sql, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

// 创建连接池
const pool = mysql.createPool(config.db);

// 封装查询方法
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        debugger;
        return reject(err);
      }
      connection.query(sql, params, (error, results) => {
        connection.release(); // 释放连接
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  });
};

// 使用实例
// const db = require('./db');
// async function getUserById(id) {
//     try {
//         const sql = 'SELECT * FROM users WHERE id = ?';
//         const results = await db.query(sql, [id]);
//         console.log(results);
//     } catch (error) {
//         console.error('Error fetching user:', error);
//     }
// }

module.exports = { query, connectQuery };
