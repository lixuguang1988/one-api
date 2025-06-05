const express = require('express');
const { query } = require('../database/db');
const { buildSelectClause, buildUpdateClause } = require('../utils/sql');
const jwtVerify = require('../middleware/jwtVerify');

const router = express.Router();

router.get('/list', jwtVerify, async (req, res) => {
  try {
    const { name, code } = req.query;

    const conditions = [
      {
        fieldName: 'name',
        fieldValue: name || undefined,
        operator: 'LIKE',
      },
      {
        fieldName: 'code',
        fieldValue: code || undefined,
        operator: 'LIKE',
      },
      {
        fieldName: 'parent_id',
        fieldValue: null,
        operator: 'IS',
      },
    ];

    const { whereClause, values } = buildSelectClause(conditions, []);

    let sql = `SELECT * FROM dicts ${whereClause} ORDER BY created_at ASC`;
    let results = await query(sql, [...values]);
    // let resCount = await query(`SELECT COUNT(*) AS total FROM dicts ${whereClause}`, values);

    if (results.length) {
      // 如果有结果，则遍历结果并获取父级栏目信息
      for (const dict of results) {
        sql = `SELECT * FROM dicts where parent_id = ? ORDER BY created_at ASC`;
        const children = await query(sql, [dict.id]);
        if (children.length) {
          dict.children = children.map((item) => ({
            ...item,
            parentId: item.parent_id,
          }));
        }
      }
      return res.status(200).json({
        code: 200,
        message: '成功',
        data: results,
      });
    } else {
      return res.status(200).json({
        code: 200,
        message: '暂无数据',
        data: [],
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: '查询失败', data: error.toString() });
  }
});

router.get('/:id/list', jwtVerify, async (req, res) => {
  try {
    const { id } = req.params;
    let sql = `SELECT * FROM dicts where parent_id = ? ORDER BY updated_at DESC`;
    let results = await query(sql, [id]);

    if (results.length) {
      return res.status(200).json({
        code: 200,
        message: '成功',
        data: results,
      });
    } else {
      return res.status(200).json({
        code: 200,
        message: '暂无数据',
        data: [],
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: '查询失败', data: error.toString() });
  }
});

router.post('/add', jwtVerify, async (req, res) => {
  try {
    const { name, code, description, parentId = null } = req.body;
    let sql;
    let results;
    // 同名检查
    sql =
      'SELECT * FROM dicts WHERE (parent_id = ? OR parent_id IS NULL) AND (name = ? OR code = ?)';
    results = await query(sql, [parentId, name, code]);
    if (results.length > 0) {
      return res.status(200).json({
        code: 500,
        message: '同级名称编码不能重复',
        data: null,
      });
    }

    sql = 'INSERT INTO dicts SET ?';
    results = await query(sql, { name, description, parent_id: parentId, code });

    if (results) {
      return res.status(200).json({
        code: 200,
        message: '添加成功',
        data: {
          id: results.insertId,
          name,
          description,
          parentId,
        },
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
    const { name, code, parentId, description, id } = req.body;
    let sql, results;

    // if (parentId) {
    //   sql = `SELECT * FROM dicts WHERE id = ? LIMIT 1`;
    //   results = await query(sql, [id]);
    //   if (results.length === 0) {
    //     return res.status(200).json({
    //       code: 500,
    //       message: '数据不存在',
    //       data: null,
    //     });
    //   } else if (results[0].parent_id === null) {
    //     return res.status(200).json({
    //       code: 500,
    //       message: '根节点不能修改为子节点',
    //       data: null,
    //     });
    //   }
    // }

    if (parentId === id) {
      return res.status(200).json({
        code: 500,
        message: '父级不能是自身',
        data: null,
      });
    }

    const conditions = [
      {
        fieldName: 'parent_id',
        fieldValue: parentId,
        operator: '=',
      },
    ];

    const { clause } = buildSelectClause(conditions, []); // (parent_id = ? OR parent_id IS NULL)

    sql = `SELECT * FROM dicts WHERE (name = ? OR code = ?) AND ${clause[0]} AND id != ? LIMIT 1`;
    const defaultValues = [name, code, id];
    if (parentId !== null) {
      defaultValues.splice(2, 0, parentId);
    }
    results = await query(sql, defaultValues);
    if (results.length > 0) {
      return res.status(200).json({
        code: 500,
        message: '同级名称编码不能重复',
        data: null,
      });
    }

    const { setClause, values } = buildUpdateClause(
      { name, code, parent_id: parentId, description },
      [id],
    );
    sql = `UPDATE dicts SET ${setClause} WHERE id = ?`;
    results = await query(sql, values);
    if (results.affectedRows > 0) {
      return res.status(200).json({
        code: 200,
        message: '更新成功',
        data: null,
      });
    } else {
      return res.status(200).json({
        code: 500,
        message: '更新失败',
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

router.delete('/:id', jwtVerify, async (req, res) => {
  try {
    const { id } = req.params;
    let sql = `SELECT * FROM dicts WHERE id = ? LIMIT 1`;
    let results = await query(sql, [id]);
    if (results.length === 0) {
      return res.status(200).json({
        code: 200,
        message: '删除成功',
        data: null,
      });
    } else if (results[0].parent_id === null) {
      return res.status(200).json({
        code: 500,
        message: '根节点不能删除',
        data: null,
      });
    }
    sql = 'DELETE FROM dicts WHERE id = ?';
    results = await query(sql, [id]);
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

module.exports = router;
