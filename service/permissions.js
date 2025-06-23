const { query } = require('../database/db');
const { buildUpdateClause, buildSelectClause } = require('../utils/sql');

const permissionObject = (rowData) => {
  const { id, menuName, menuCode, operation, parent_id } = rowData;
  return {
    id,
    menuName,
    menuCode,
    operation: (operation || '').split(',').filter(Boolean),
    parentId: parent_id,
    // children: [],
  };
};

const getHierarchy = async (baseConditions, parentId) => {
  const result = await getListByParentId(baseConditions, parentId);
  for (const item of result) {
    const children = await getHierarchy(baseConditions, item.id);
    if (children.length) {
      item.children = children;
    } else {
      item.isLeaf = true;
    }
  }
  return result;
};
// Function to fetch a department by its ID
const getListByParentId = async (baseConditions, parentId) => {
  const conditions = baseConditions.concat({
    fieldName: 'parent_id',
    fieldValue: parentId,
    operator: parentId == null ? 'is' : '=',
  });
  const { whereClause, values } = buildSelectClause(conditions, []);
  let sql = `SELECT * FROM permissions ${whereClause} ORDER BY updated_at DESC`;
  let results = await query(sql, values);
  return (results || []).map((item) => permissionObject(item));
};

module.exports = {
  getHierarchy,
};
