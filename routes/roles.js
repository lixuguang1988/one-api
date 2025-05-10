const express = require('express');
const { query } = require('../database/db');
const jwtVerify = require('../middleware/jwtVerify');
const { buildSelectClause, buildUpdateClause } = require('../utils/sql');

const router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/add', async (req, res) => {
  try {
    const { roleName, description, permission } = req.body;
 
    let sql = 'SELECT * FROM roles WHERE roleName = ?';
    let results = await query(sql, [roleName]);
    if (results.length > 0) {
      return res.status(200).json({ 
        code: 500,
        message: '角色已存在',
        data: null
       });
    }
    sql = 'INSERT INTO roles SET ?';
    results = await query(sql, { roleName, description, permission: JSON.stringify(permission)});
 
    res.status(200).json({ code: 200, message: '新增成功', data: null });
  } catch (error) {
    debugger
    res.status(200).json({ code: 500, message: '新增失败', data: error.toString() });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { roleName, description, permission, id} = req.body;

    let sql = 'SELECT * FROM roles WHERE roleName = ? AND id != ?';
    let results = await query(sql, [roleName, id]);
    if (results.length > 0) {
      return res.status(200).json({ 
        code: 500,
        message: '角色已存在',
        data: null
       });
    }

    const { setClause, values}  = buildUpdateClause({ roleName, description, permission: JSON.stringify(permission)}, [id])
    sql = `UPDATE roles SET ${setClause} WHERE id = ?`;
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
    const { currentPage = 1, pageSize = 10, roleName, menuCode } = req.query;

    const conditions = [{
      fieldName: 'roleName',
      fieldValue: roleName || undefined,
      operator: 'LIKE'
    }]
    
    const { whereClause, values } = buildSelectClause(conditions, []);

    let sql = `SELECT * FROM roles ${whereClause} ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
    let results = await query(sql, [...values, parseInt(pageSize), (parseInt(currentPage) -1) * parseInt(pageSize)]);
    let resCount = await query(`SELECT COUNT(*) AS total FROM roles ${whereClause}`, values);

    if (results.length) {
      return res.status(200).json({ 
        code: 200,
        message: '成功',
        data: {
          total: resCount[0]?.total,
          list: results.map(item => {
            return {
              ...item,
              permission: JSON.parse(item.permission)
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

router.post('/user', async (req, res) => {
  try {
    const { roleId, userId } = req.body;
 
    let sql = 'SELECT * FROM role_users WHERE role_id = ? AND user_id = ?';
    let results = await query(sql, [roleId, userId]);
    if (results.length > 0) {
      return res.status(200).json({ 
        code: 500,
        message: '用户已存在',
        data: null
       });
    }
    sql = 'INSERT INTO role_users SET ?';
    results = await query(sql, { role_id: roleId, user_id : userId });
    if (results.affectedRows ) {
      res.status(200).json({ code: 200, message: '新增成功', data: null });
    } else {
      res.status(200).json({ code: 500, message: '新增失败', data: null })
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: '新增失败', data: error.toString() });
  }
});
router.delete('/user', async (req, res) => {
  try {
    const { roleId, userId } = req.body;
 
    let sql = 'DELETE FROM role_users WHERE role_id = ? AND user_id = ?';
    let results = await query(sql, [roleId, userId]);
    if (results.affectedRows ) {
      return res.status(200).json({ 
        code: 200,
        message: '删除成功',
        data: null
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


router.get('/user', jwtVerify, async (req, res) => {
  try {
    const { currentPage = 1, pageSize = 10, roleId } = req.query;

    const conditions = [{
      fieldName: 'ru.role_id',
      fieldValue: roleId || undefined,
      operator: '='
    }, {
      fieldName: 'u.status',
      fieldValue: 1,
      operator: '='
    }]
    
    const { whereClause, values } = buildSelectClause(conditions, []);

    let sql = `SELECT u.*, r.roleName AS role_name FROM users u INNER JOIN role_users ru ON u.id = ru.user_id INNER JOIN roles r ON ru.role_id = r.id ${whereClause} ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
    let results = await query(sql, [...values, parseInt(pageSize), (parseInt(currentPage) -1) * parseInt(pageSize)]);
    sql = `SELECT COUNT(*) AS total FROM users u INNER JOIN role_users ru ON u.id = ru.user_id INNER JOIN roles r ON ru.role_id = r.id ${whereClause} `;
    let resCount = await query(sql, values);

    if (results.length) {
      return res.status(200).json({ 
        code: 200,
        message: '成功',
        data: {
          total: resCount[0]?.total,
          list: results.map(item => {
            return {
              ...item,
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


router.delete('/:id', jwtVerify, async (req, res) => {
  try {
    const { id } = req.params;
 
    let sql = 'DELETE FROM roles WHERE id = ?';
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
