const res = require('express/lib/response');

/**
 * 构建更新语句
 * @param {Object} fields 需要更新的字段
 * @param {...any} resetValues 需要更新的字段的值
 * @returns {string} 更新语句
 */
function buildUpdateClause(fields, ...resetValues) {
  const setClauseArray = [];
  const values = [];

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) {
      setClauseArray.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (setClauseArray.length === 0) {
    throw new Error('没有提供任何字段进行更新');
  }

  resetValues.forEach((resetValue) => {
    values.push(resetValue);
  });
  return {
    setClause: setClauseArray.join(', '),
    clause: setClauseArray,
    values,
  };
}

/**
 * 构建选择语句
 * @param {Object} conditions - 条件对象
 * @param {Array} resetValues - 其他参数数组
 * @returns {Object} - 包含setClause、clause和values的对象
 */
const buildSelectClause = (conditions, resetValues = []) => {
  const whereClauseArray = [];
  const values = [];

  conditions.forEach((condition) => {
    if (condition.fieldValue !== undefined) {
      if (condition.fieldValue === null) {
        whereClauseArray.push(`${condition.fieldName} is NULL`);
      } else if (['IN', 'NOT IN'].includes(condition.operator)) {
        const placeholders = condition.fieldValue.map(() => '?').join(',');
        whereClauseArray.push(`${condition.fieldName} ${condition.operator} (${placeholders})`);
        values.push(...condition.fieldValue);
      } else if (['LIKE'].includes(condition.operator)) {
        whereClauseArray.push(`${condition.fieldName} ${condition.operator} ?`);
        values.push(`%${condition.fieldValue}%`);
      } else if (['JSON_CONTAINS'].includes(condition.operator)) {
        whereClauseArray.push(`${condition.operator}(${condition.fieldName}  ?)`);
        values.push(condition.fieldValue);
      } else {
        whereClauseArray.push(`${condition.fieldName} ${condition.operator} ?`);
        values.push(condition.fieldValue);
      }
    }
  });

  resetValues.forEach((resetValue) => {
    values.push(resetValue);
  });

  return {
    whereClause: whereClauseArray.length ? ' WHERE ' + whereClauseArray.join(' AND ') : ' ',
    clause: whereClauseArray,
    values,
  };
};

// const conditions = [
//     {
//         group: [
//             { fieldName: 'name', fieldValue: 'John', operator: 'LIKE' },
//             { fieldName: 'age', fieldValue: 25, operator: '=' }
//         ],
//         logicalOperator: 'AND'
//     },
//     {
//         group: [
//             { fieldName: 'status', fieldValue: 'active', operator: '=' },
//             { fieldName: 'role', fieldValue: 'admin', operator: '=' }
//         ],
//         logicalOperator: 'OR'
//     }
// ];

// const { whereClause, values } = buildSelectClause(conditions);
// console.log(whereClause); // 输出: WHERE (name LIKE ? AND age = ?) OR (status = ? AND role = ?)
// console.log(values); // 输出: ['%John%', 25, 'active', 'admin']
const buildGroupSelectClause = (conditions, resetValues = []) => {
  const whereClauseArray = [];
  const values = [];

  const buildCondition = (condition) => {
    if (condition.fieldValue !== undefined) {
      if (condition.fieldValue === null) {
        return `${condition.fieldName} IS NULL`;
      } else if (['IN', 'NOT IN'].includes(condition.operator)) {
        const placeholders = condition.fieldValue.map(() => '?').join(',');
        values.push(...condition.fieldValue);
        return `${condition.fieldName} ${condition.operator} (${placeholders})`;
      } else if (['LIKE'].includes(condition.operator)) {
        values.push(`%${condition.fieldValue}%`);
        return `${condition.fieldName} ${condition.operator} ?`;
      } else {
        values.push(condition.fieldValue);
        return `${condition.fieldName} ${condition.operator} ?`;
      }
    }
    return '';
  };

  const buildGroup = (group, logicalOperator) => {
    const groupClauses = group
      .map((condition) => {
        if (condition.group) {
          return `(${buildGroup(condition.group, condition.logicalOperator)})`;
        } else {
          return buildCondition(condition);
        }
      })
      .filter((clause) => clause !== '');

    return groupClauses.join(` ${logicalOperator || 'AND'} `);
  };

  conditions.forEach((condition) => {
    if (condition.group) {
      whereClauseArray.push(`(${buildGroup(condition.group, condition.logicalOperator)})`);
    } else {
      const clause = buildCondition(condition);
      if (clause) {
        whereClauseArray.push(clause);
      }
    }
  });

  resetValues.forEach((resetValue) => {
    values.push(resetValue);
  });

  return {
    whereClause: whereClauseArray.length ? ' WHERE ' + whereClauseArray.join(' AND ') : ' ',
    clause: whereClauseArray,
    values,
  };
};

module.exports = { buildUpdateClause, buildSelectClause, buildGroupSelectClause };
