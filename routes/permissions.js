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
    const { menuName, menuCode, operation, } = req.body;
 
    let sql = 'SELECT * FROM permissions WHERE menuCode = ?';
    let results = await query(sql, [menuCode]);
    if (results.length > 0) {
      return res.status(200).json({ 
        code: 500,
        message: '菜单编码已存在',
        data: null
       });
    }
    sql = 'INSERT INTO permissions SET ?';
    results = await query(sql, { menuName, menuCode, operation: Array.isArray(operation) ? operation.join(",") : "" });
 
    res.status(200).json({ code: 200, message: '新增成功', data: null });
  } catch (error) {
    debugger
    res.status(200).json({ code: 500, message: '新增失败', data: error.toString() });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { menuName, menuCode, operation, id} = req.body;

    let sql = 'SELECT * FROM permissions WHERE menuCode = ? AND id != ?';
    let results = await query(sql, [menuCode, id]);
    if (results.length > 0) {
      return res.status(200).json({ 
        code: 500,
        message: '菜单编码已存在',
        data: null
       });
    }

    const { setClause, values}  = buildUpdateClause({ menuName, menuCode, operation: Array.isArray(operation) ? operation.join(",") : "" }, [id])
    sql = `UPDATE permissions SET ${setClause} WHERE id = ?`;
    results = await query(sql, values);
    if (results.affectedRows > 0) {
      return res.status(200).json({
        code: 200,
        message: '更新成功',
        data: null
      });
    } else {
      return res.status(200).json({
        code: 500,
        message: '更新失败',
        data: null
      });
    }

  } catch(error) {
    res.status(200).json({
      code: 500,
      message: '更新失败',
      data: error.toString()
    });
  }
});

router.get('/list', jwtVerify, async (req, res) => {
  try {
    const { currentPage = 1, pageSize = 10, menuName, menuCode } = req.query;

    const conditions = [{
      fieldName: 'menuName',
      fieldValue: menuName || undefined,
      operator: 'LIKE'
    }, {
      fieldName: 'menuCode',
      fieldValue: menuCode || undefined,
      operator: 'LIKE'
    }]
    
    const { whereClause, values } = buildSelectClause(conditions, []);

    let sql = `SELECT * FROM permissions ${whereClause} ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
    let results = await query(sql, [...values, parseInt(pageSize), (parseInt(currentPage) -1) * parseInt(pageSize)]);
    let resCount = await query(`SELECT COUNT(*) AS total FROM permissions ${whereClause}`, values);

    if (results.length) {
      return res.status(200).json({ 
        code: 200,
        message: '成功',
        data: {
          total: resCount[0]?.total,
          list: results.map(item => {
            return {
              ...item,
              operation: (item.operation || "").split(",").filter(item => item)
            }
          }),
          currentPage: currentPage,
          pageSize: pageSize
        }
       });
    } else {
      return res.status(200).json({ 
        code: 200,
        message: '暂无数据',
        data: {
          total: 0,
          list: [],
          currentPage: currentPage,
          pageSize: pageSize
        }
      });
    }

  } catch (error) {
    res.status(200).json({ code: 200, message: '注册失败2', data: error.toString() });
  }
});

router.get('/hierarchy', jwtVerify, async (req, res) => {
  try {
    let sql = `SELECT * FROM permissions ORDER BY updated_at DESC`;
    let results = await query(sql);

    if (results.length) {
      return res.status(200).json({ 
        code: 200,
        message: '成功',
        data:results.map(item => {
            return {
              ...item,
              operation: (item.operation || "").split(",").filter(item => item)
            }
          })
       });
    } else {
      return res.status(200).json({ 
        code: 200,
        message: '暂无数据',
        data: []
      });
    }

  } catch (error) {
    res.status(200).json({ code: 200, message: '注册失败2', data: error.toString() });
  }
});

router.delete('/:id', jwtVerify, async (req, res) => {
  try {
    const { id } = req.params;
 
    let sql = 'DELETE FROM permissions WHERE id = ?';
    let results = await query(sql, [id]);
    if (results.affectedRows ) {
      return res.status(200).json({ 
        code: 200,
        message: '删除成功',
        data: id
       });
    } else {
      return res.status(200).json({ 
        code: 500,
        message: '删除失败',
        data: null
      });
    }

  } catch (error) {
    res.status(200).json({ code: 500, message: '删除失败', data: error.toString() });
  }
});


module.exports = router;
