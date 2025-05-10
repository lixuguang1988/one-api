const res = require("express/lib/response");

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

    resetValues.forEach(resetValue => {
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
   

    conditions.forEach(condition => {
        if (condition.fieldValue !== undefined) {
            if (["IN", "NOT IN"].includes(condition.operator)) {
                const placeholders = condition.fieldValue.map(() => '?').join(',');
                whereClauseArray.push(`${condition.fieldName} ${condition.operator} (${placeholders})`);
                values.push(...condition.fieldValue);
            } else if (["LIKE"].includes(condition.operator)) {
                whereClauseArray.push(`${condition.fieldName} ${condition.operator} ?`);
                values.push(`%${condition.fieldValue}%`);
            } else {
                whereClauseArray.push(`${condition.fieldName} ${condition.operator} ?`);
                values.push(condition.fieldValue);
            }
        }
    });

    resetValues.forEach(resetValue => {
        values.push(resetValue);
    });

    return {
        whereClause: whereClauseArray.length ? " WHERE "  + whereClauseArray.join(' AND ') : ' ' ,
        clause: whereClauseArray,
        values,
    }; 
}

module.exports = { buildUpdateClause, buildSelectClause };