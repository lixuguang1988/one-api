const express = require('express');
const jwt = require('jsonwebtoken');
const { query } = require('../database/db');
const { hSet } = require('../redis/index');
const { jwtConfig } = require('../config/index');
const jwtVerify = require('../middleware/jwtVerify');
const { hashPassword } = require('../utils/index');
const { buildSelectClause, buildUpdateClause } = require('../utils/sql');

const router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/add', async (req, res) => {
  try {
    const { username, email, password = 'Aa123789', phone } = req.body;

    let sql = 'SELECT * FROM users WHERE username = ?';
    let results = await query(sql, [username]);
    if (results.length > 0) {
      return res.status(200).json({
        code: 500,
        message: '用户名不能重复',
        data: null,
      });
    }

    sql = 'SELECT * FROM users WHERE email = ?';
    results = await query(sql, [email]);
    if (results.length > 0) {
      return res.status(200).json({
        code: 500,
        message: '邮箱不能重复',
        data: null,
      });
    }

    const hashedPassword = await hashPassword(password);
    sql = 'INSERT INTO users SET ?';
    results = await query(sql, { username, email, password: hashedPassword, phone });

    res.status(200).json({ code: 200, message: '新增成功', data: null });
  } catch (error) {
    debugger;
    res.status(200).json({ code: 500, message: '新增失败', data: error.toString() });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { username, email, phone, id } = req.body;
    const { setClause, values } = buildUpdateClause({ username, email, phone }, [id]);
    let sql = `UPDATE users SET ${setClause} WHERE id = ?`;
    let results = await query(sql, values);
    if (results.affectedRows > 0) {
      return res.status(200).json({
        code: 200,
        message: '更新成功',
        data: null,
      });
    } else {
      return res.status(200).json({
        code: 500,
        message: '更新失败，用户不存在或数据未更改',
        data: null,
      });
    }
  } catch (error) {
    res.status(200).json({
      code: 500,
      message: '更新失败',
      data: error.toString(),
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const hashedPassword = await hashPassword(password);
    let results = await query(sql, [username, hashedPassword]);
    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign(
        { id: user.id, phone: user.phone, username: user.username },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn },
      );
      const { password, ...restProps } = results[0];
      return res.status(200).json({
        code: 200,
        message: '登录成功',
        data: {
          ...restProps,
          token,
        },
      });
    } else {
      return res.status(200).json({
        code: 500,
        message: '用户名或密码错误',
        data: null,
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: '登录失败', data: error.toString() });
  }
});

router.post('/logout', jwtVerify, async (req, res) => {
  try {
    const auth = req.auth;
    if (auth && auth.iat) {
      const setRes = await hSet('blackIatList', String(auth.iat), String(auth.exp));
      if (!setRes) {
        return res.status(200).json({
          code: 500,
          message: '注销失败',
          data: null,
        });
      }
    }
    return res.status(200).json({
      code: 200,
      message: '注销成功',
      data: null,
    });
  } catch (error) {
    return res.status(200).json({ code: 500, message: '注销失败', data: error.toString() });
  }
});

router.get('/list', jwtVerify, async (req, res) => {
  try {
    const { currentPage = 1, pageSize = 10, keyword, status } = req.query;

    const conditions = [
      {
        fieldName: 'username',
        fieldValue: keyword || undefined,
        operator: 'LIKE',
      },
    ];

    if (status == null) {
      conditions.push({
        fieldName: 'status',
        fieldValue: [1, 2],
        operator: 'IN',
      });
    } else {
      conditions.push({
        fieldName: 'status',
        fieldValue: status,
        operator: '=',
      });
    }

    const { whereClause, values } = buildSelectClause(conditions, []);

    let sql = `SELECT * FROM users ${whereClause}  ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
    let results = await query(sql, [
      ...values,
      parseInt(pageSize),
      (parseInt(currentPage) - 1) * parseInt(pageSize),
    ]);
    let resCount = await query(`SELECT COUNT(*) AS total FROM users ${whereClause}`, values);

    if (results.length) {
      return res.status(200).json({
        code: 200,
        message: '成功',
        data: {
          total: resCount[0]?.total,
          list: results.map((item) => {
            const { password, ...user } = item;
            return user;
          }),
          currentPage: currentPage,
          pageSize: pageSize,
        },
      });
    } else {
      return res.status(200).json({
        code: 200,
        message: '暂无数据',
        data: {
          total: 0,
          list: [],
          currentPage: currentPage,
          pageSize: pageSize,
        },
      });
    }
  } catch (error) {
    res.status(200).json({ code: 200, message: '注册失败2', data: error.toString() });
  }
});

router.get('/permission', jwtVerify, async (req, res) => {
  try {
    const { id, phone, username } = req.auth;

    let sql = `SELECT * FROM role_users WHERE user_id = ?`;
    let results = await query(sql, [id]);

    if (results.length) {
      const placeholders = results.map((item) => '?').join(',');
      const roles = results.map((item) => item.role_id);
      sql = `SELECT * FROM roles WHERE id IN (${placeholders})`;
      results = await query(sql, [roles]);
      const permissions = [];
      results.forEach((item) => {
        permissions.push(JSON.parse(item.permission));
      });
      const menus = {};
      permissions.forEach((permission) => {
        Object.keys(permission).forEach((key) => {
          if (!menus[key]) {
            menus[key] = [];
          }
          menus[key].push(permission[key]);
          menus[key] = [...new Set(menus[key])];
        });
      });

      return res.status(200).json({
        code: 200,
        message: '成功',
        data: menus,
      });
    } else {
      return res.status(200).json({
        code: 200,
        message: '暂无权限',
        data: {},
      });
    }
  } catch (error) {
    res.status(200).json({ code: 200, message: '暂无权限', data: {} });
  }
});

router.delete('/batch', jwtVerify, async (req, res) => {
  try {
    const { idList } = req.body;

    // 检查 idList 是否存在且不为空
    if (!idList || !Array.isArray(idList) || idList.length === 0) {
      return res.status(200).json({
        code: 500,
        message: 'ID 列表不能为空',
        data: null,
      });
    }
    const placeholders = idList.map(() => '?').join(',');
    let sql = `UPDATE users SET status = 0 WHERE id IN (${placeholders})`;
    let results = await query(sql, idList);
    if (results.affectedRows) {
      return res.status(200).json({
        code: 200,
        message: '删除成功',
        data: null,
      });
    } else {
      return res.status(200).json({
        code: 500,
        message: '删除失败',
        data: null,
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: '删除失败', data: error.toString() });
  }
});

router.delete('/:id', jwtVerify, async (req, res) => {
  try {
    const { id } = req.params;

    let sql = 'UPDATE users SET status = 0 WHERE id = ?';
    let results = await query(sql, [id]);
    if (results.affectedRows) {
      return res.status(200).json({
        code: 200,
        message: '删除成功',
        data: id,
      });
    } else {
      return res.status(200).json({
        code: 500,
        message: '删除失败',
        data: null,
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: '删除失败', data: error.toString() });
  }
});

router.get('/:id', jwtVerify, async (req, res) => {
  try {
    debugger;
    const { id } = req.params;

    let sql = 'SELECT * FROM users WHERE id = ?';
    let results = await query(sql, [id]);
    if (results.length === 1) {
      const data = results[0];
      const { password, ...user } = data;
      return res.status(200).json({
        code: 200,
        message: '成功',
        data: user,
      });
    } else {
      return res.status(200).json({
        code: 500,
        message: '用户不存在',
        data: null,
      });
    }
  } catch (error) {
    res.status(200).json({ code: 200, message: '注册失败2', data: error.toString() });
  }
});

module.exports = router;
