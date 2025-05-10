const express = require('express');
const { query } = require('../database/db');
const { buildUpdateClause } = require('../utils/sql');
const jwtVerify = require('../middleware/jwtVerify');
const { getDepartmentById, getDepartmentHierarchy, getDepartmentsByParentId, insertUserToDepartment} = require('../service/departments');

const router = express.Router();

// 往部门里面添加用户
router.post('/user', jwtVerify, async (req, res) => {
  try {
    const { departmentId, userId } = req.body;

    // 检查 department_id 和 user_id 是否存在
    if (!departmentId || !userId) {
      return res.status(200).json({ 
        code: 500,
        message: '缺少必要字段',
        data: null
      });
    }

    const result = await insertUserToDepartment(userId, departmentId);
    if (result) {
      return res.status(200).json({ 
        code: 200,
        message: '添加成功',
        data: null
      });
    } else {
      res.status(200).json({ code: 500, message: '添加失败', data: null });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: error.toString(), data: null });
  }
});

router.post('/users', jwtVerify, async (req, res) => {
  try {
    const { departmentId, userIds } = req.body;

    // 检查是否存在
    if (!departmentId || !Array.isArray(userIds) || !userIds.length) {
      return res.status(200).json({ 
        code: 500,
        message: '缺少必要字段',
        data: null
      });
    }

    let successCount = 0;
    let failIds = []
    for (const userId of userIds) {
      const result = await insertUserToDepartment(userId, departmentId);
      if (result) {
        successCount++;
      } else {
        failIds.push(userId);
      }
    }

    if (successCount === userIds.length) {
      return res.status(200).json({
        code: 200,
        message: '插入成功',
        data: {
          successCount: successCount,
          failIds: failIds
        }
      });
    } else {
      return res.status(200).json({
        code: 500,
        message: '部分插入失败',
        data: {
          successCount,
          failIds: failIds
        }
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: error.toString(), data: null });
  }
});

router.delete('/user', async (req, res) => {
  try {
    const { departmentId, userId } = req.body;

    // 检查是否存在
    if (!departmentId || !userId) {
      return res.status(200).json({ 
        code: 500,
        message: '缺少必要字段',
        data: null
      });
    }

    // 删除记录
    const sql = 'DELETE FROM user_departments WHERE department_id = ? AND user_id = ?';
    const results = await query(sql, [department_id, user_id]);

    if (results.affectedRows > 0) {
      return res.status(200).json({ 
        code: 200,
        message: '删除成功',
        data: null
      });
    } else {
      return res.status(200).json({ 
        code: 500,
        message: '记录不存在',
        data: null
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: error.toString(), data: null });
  }
});

router.delete('/users', async (req, res) => {
  try {
    const { departmentId, userIds } = req.body;

    // 检查 department_id 和 user_id 是否存在
    if (!departmentId || !Array.isArray(userIds) || !userIds.length) {
      return res.status(200).json({ 
        code: 500,
        message: '缺少必要字段',
        data: null
      });
    }

    const clause = userIds.map(() => '?').join(', ');
    const sql = `DELETE FROM user_departments WHERE department_id = ? AND user_id IN (${clause})`;
    const results = await query(sql, [department_id, ...userIds]);

    if (results.affectedRows > 0) {
      return res.status(200).json({ 
        code: 200,
        message: '删除成功',
        data: null
      });
    } else {
      return res.status(200).json({ 
        code: 500,
        message: '记录不存在',
        data: null
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: error.toString(), data: null });
  }
});

router.get('/list', jwtVerify, async (req, res) => {
  try {
    const { parentId = null } = req.query;

    const result = await getDepartmentsByParentId(parentId);
    if (result) {
      return res.status(200).json({ 
        code: 200,
        message: '成功',
        data: result
       });
    } else {
      return res.status(200).json({ 
        code: 200,
        message: '成功',
        data: []
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: error.toString(), data: null });
  }
});

router.get('/hierarchy', jwtVerify, async (req, res) => {
  try {
    const { parentId } = req.params;

    const result = await getDepartmentHierarchy(parentId);
    if (result) {
      return res.status(200).json({ 
        code: 200,
        message: '成功',
        data: result
       });
    } else {
      return res.status(200).json({ 
        code: 200,
        message: '成功',
        data: []
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: error.toString(), data: null });
  }
});

router.get('/:id', jwtVerify, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getDepartmentById(id);
    if (result) {
      return res.status(200).json({ 
        code: 200,
        message: '成功',
        data: result
       });
    } else {
      return res.status(200).json({ 
        code: 500,
        message: '不存在',
        data: null
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: error.toString(), data: null });
  }
});

router.post('/', jwtVerify, async (req, res) => {
  try {
    const { name, description, parentId } = req.body;

    let sql;
    let results;
    // 同名检查
    sql = 'SELECT * FROM departments WHERE parent_id = ? AND name = ?';
    results = await query(sql, [parentId, name]);
    if (results.length > 0) {
      return res.status(200).json({ 
        code: 500,
        message: '同级部门名称不能重复',
        data: null
        });
    }
 
    sql = 'INSERT INTO departments (name, description, parent_id) VAlUES (?, ?, ?)';
    results = await query(sql, [name, description, parentId]);

    if (results) {
      return res.status(200).json({ 
        code: 200,
        message: '添加成功',
        data: {
          id: results.insertId,
          name,
          description
        }
      });
    } else {
      res.status(200).json({ code: 500, message: '添加失败', data: null });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: error.toString(), data: null });
  }
});

module.exports = router;
