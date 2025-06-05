const express = require('express');
const { query } = require('../database/db');
const { buildSelectClause, buildUpdateClause } = require('../utils/sql');
const jwtVerify = require('../middleware/jwtVerify');
const { getColumnById, getHierarchy } = require('../service/columns');

const router = express.Router();

router.get('/list', jwtVerify, async (req, res) => {
  try {
    const { currentPage = 1, pageSize = 10, keyword, status, columnId } = req.query;

    const conditions = [
      {
        fieldName: 'n.name',
        fieldValue: keyword || undefined,
        operator: 'LIKE',
      },
      {
        fieldName: 'n.status',
        fieldValue: status,
        operator: '=',
      },
    ];

    const { whereClause, values } = buildSelectClause(conditions, []);

    let sql = `SELECT n.*, u.username as updater FROM pets n INNER JOIN users u ON n.updater_id = u.id  ${whereClause} ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
    let results = await query(sql, [
      ...values,
      parseInt(pageSize),
      (parseInt(currentPage) - 1) * parseInt(pageSize),
    ]);
    let resCount = await query(
      `SELECT COUNT(*) AS total FROM news n INNER JOIN users u ON n.updater_id = u.id ${whereClause}`,
      values,
    );

    if (results.length) {
      return res.status(200).json({
        code: 200,
        message: '成功',
        data: {
          total: resCount[0]?.total,
          list: results.map((item) => ({
            ...item,
            picture: (item.pictures || '').split(';'),
          })),
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

router.post('/add', jwtVerify, async (req, res) => {
  try {
    const { name, price, color, pictures, description, status, type, years, vaccine } = req.body;
    let sql;
    let results;

    sql = 'INSERT INTO pets SET ?';
    results = await query(sql, {
      name,
      price,
      pictures,
      color,
      description,
      status,
      type,
      // years,
      vaccine,
      creater_id: req.auth.id,
      updater_id: req.auth.id,
    });

    if (results) {
      return res.status(200).json({
        code: 200,
        message: '添加成功',
        data: {
          id: results.insertId,
        },
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
    const { name, price, color, pictures, description, status, type, years, vaccine, id } =
      req.body;

    const { setClause, values } = buildUpdateClause(
      {
        name,
        price,
        color,
        pictures,
        description,
        status,
        type,
        years,
        vaccine,
        updater_id: req.auth.id,
      },
      [id],
    );
    sql = `UPDATE pets SET ${setClause} WHERE id = ?`;
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

    let sql = 'DELETE FROM pets WHERE id = ?';
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
    const { id } = req.params;

    let sql = 'SELECT * FROM pets WHERE id = ?';
    let results = await query(sql, [id]);
    if (results.length) {
      return res.status(200).json({
        code: 200,
        message: '成功',
        data: results[0],
      });
    } else {
      return res.status(200).json({
        code: 500,
        message: '数据不存在',
        data: null,
      });
    }
  } catch (error) {
    res.status(200).json({ code: 500, message: '数据不存在', data: error.toString() });
  }
});

module.exports = router;
