const express = require('express');
const { query } = require('../database/db');
const { buildSelectClause, buildUpdateClause } = require('../utils/sql');
const jwtVerify = require('../middleware/jwtVerify');
const { getColumnById, getHierarchy } = require('../service/columns');

const router = express.Router();

router.get('/list', jwtVerify, async (req, res) => {
  try {
    const { currentPage = 1, pageSize = 10, keyword, status, columnId } = req.query;

    const conditions = [{
      fieldName: 'n.title',
      fieldValue: keyword || undefined,
      operator: 'LIKE'
    }, {
      fieldName: 'n.status',
      fieldValue: status,
      operator: '='
    }, {
      fieldName: 'n.columns',
      fieldValue: columnId,
      operator: 'JSON_CONTAINS'
    }]
    
    const { whereClause, values } = buildSelectClause(conditions, []);

    let sql = `SELECT n.*, u.username as updater FROM news n INNER JOIN users u ON n.updater_id = u.id  ${whereClause} ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
    let results = await query(sql, [...values, parseInt(pageSize), (parseInt(currentPage) -1) * parseInt(pageSize)]);
    let resCount = await query(`SELECT COUNT(*) AS total FROM news n INNER JOIN users u ON n.updater_id = u.id ${whereClause}`, values);

    if (results.length) {
      // 如果有结果，则遍历结果并获取父级栏目信息
      for (const item of results) {
        if (item.columns) {
          const columns = JSON.parse(item.columns);
          const placeholder = columns.map(column => `?`).join(',');
          sql = `SELECT * FROM columns WHERE id IN (${placeholder})`;
          const parentColumn = await query(sql, columns);
          item.columnList = parentColumn;
          item.columns = columns;
        }else {
          item.columns = []
          item.columnList = []
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

router.post('/add', jwtVerify, async (req, res) => {
  try {
    const { title, content, color, picture, description, priority, status, source, columns = [] } = req.body;
    let sql;
    let results;
 
    sql = 'INSERT INTO news SET ?';
    results = await query(sql, {title, description, priority: priority || null, color, picture, content, status, source, columns: JSON.stringify(columns), creater_id: req.auth.id, updater_id: req.auth.id});

    if (results) {
      return res.status(200).json({ 
        code: 200,
        message: '添加成功',
        data: {
          id: results.insertId,
        }
      });
    } else {
      res.status(200).json({ code: 500, message: '添加失败', data: null });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: error.toString(), data: null });
  }
});

router.post('/update', jwtVerify, async (req, res) => {
  try {
    const { id, title, content, color, picture, description, priority, status, source, columns = [] } = req.body;

    const { setClause, values}  = buildUpdateClause({title, description, priority: priority || null, color, picture, content, status, source, columns: JSON.stringify(columns), updater_id: req.auth.id}, [id])
    sql = `UPDATE news SET ${setClause} WHERE id = ?`;
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
 
    let sql = 'DELETE FROM news WHERE id = ?';
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
