const express = require('express');
const { query } = require('../database/db');
const { buildSelectClause, buildUpdateClause } = require('../utils/sql');
const jwtVerify = require('../middleware/jwtVerify');
const { getColumnById, getHierarchy } = require('../service/columns');

const router = express.Router();

router.get('/list', jwtVerify, async (req, res) => {
  try {
    const { currentPage = 1, pageSize = 10, name, code, parentId } = req.query;

    const conditions = [{
      fieldName: 'name',
      fieldValue: name || undefined,
      operator: 'LIKE'
    }, {
      fieldName: 'code',
      fieldValue: code || undefined,
      operator: 'LIKE'
    }]
    
    const { whereClause, values } = buildSelectClause(conditions, []);

    let sql = `SELECT * FROM columns ${whereClause} ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
    let results = await query(sql, [...values, parseInt(pageSize), (parseInt(currentPage) -1) * parseInt(pageSize)]);
    let resCount = await query(`SELECT COUNT(*) AS total FROM columns ${whereClause}`, values);

    if (results.length) {
      // 如果有结果，则遍历结果并获取父级栏目信息
      for (const column of results) {
        if (column.parent_id) {
          const parentColumn = await getColumnById(column.parent_id);
          column.parentId = parentColumn.id;
          column.parentName = parentColumn.name;
          column.parentCode = parentColumn.code;
        }
      }
      return res.status(200).json({ 
        code: 200,
        message: '成功',
        data: {
          total: resCount[0]?.total,
          list: results,
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
    const { parentId } = req.params;

    const result = await getHierarchy(parentId);
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

router.post('/add', jwtVerify, async (req, res) => {
  try {
    const { name, code, description, parentId = null } = req.body;
    let sql;
    let results;
    // 同名检查
    sql = 'SELECT * FROM columns WHERE (parent_id = ? OR parent_id IS NULL) AND (name = ? OR code = ?)';
    results = await query(sql, [parentId, name, code]);
    if (results.length > 0) {
      return res.status(200).json({ 
        code: 500,
        message: '同级名称编码不能重复',
        data: null
        });
    }
 
    sql = 'INSERT INTO columns SET ?';
    results = await query(sql, {name, description, parent_id: parentId, code});

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

router.post('/update', async (req, res) => {
  try {
    const { name, code, parentId, id} = req.body;

    if (parentId === id) {
      return res.status(200).json({
        code: 500,
        message: '父级不能是自身',
        data: null
      });
    }

    const conditions = [{
      fieldName: 'parent_id',
      fieldValue: parentId,
      operator: '='
    }]
    
    const { clause } = buildSelectClause(conditions, []); // (parent_id = ? OR parent_id IS NULL)

    let sql = `SELECT * FROM columns WHERE (name = ? OR code = ?) AND ${clause[0]} AND id != ? LIMIT 1`;
    const defaultValues = [name, code, id];
    if (parentId !== null)  {
      defaultValues.splice(2, 0, parentId)
    }
    let results = await query(sql, defaultValues);
    if (results.length > 0) {
      return res.status(200).json({ 
        code: 500,
        message: '同级名称编码不能重复',
        data: null
       });
    }

    const { setClause, values}  = buildUpdateClause({ name, code, parent_id: parentId }, [id])
    sql = `UPDATE columns SET ${setClause} WHERE id = ?`;
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


router.delete('/:id', jwtVerify, async (req, res) => {
  try {
    const { id } = req.params;
 
    let sql = 'DELETE FROM columns WHERE id = ?';
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
