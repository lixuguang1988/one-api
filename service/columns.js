const { query } = require('../database/db');
const { use } = require('../routes');
const { buildUpdateClause } = require('../utils/sql');

const columnObject = (rowData) => {
  const { id, name, code, description, parent_id } = rowData;
  return {
    id,
    name,
    description,
    code, 
    parentId: parent_id,
    // children: [],
  }
}

const userObject = (rowData, parent_id) => {
  const { id, email, phone, username } = rowData;
  return {
    id: `${parent_id}_${id}`,
    userId: id,
    name: username,
    phone,
    email,
    parentId: parent_id,
    isDeparntment: false,
    isLeaf: true,
    // children: [],
  }
}

const getListByParentId = async (parentId) => {
  const condition = parentId == null || parentId === "" ? 'parent_id IS NULL' : ' parent_id = ?';
  let sql = `SELECT * FROM columns WHERE ${condition}`;
  let results = await query(sql, [parentId]);
  if (results.length) {
    return results.map(columnObject);
  } else {
    return [];
  }
}

const getHierarchy = async (parentId) => {
  const columns = await getListByParentId(parentId);
  for (const column of columns) {
    const children = await getHierarchy(column.id);
    if (children.length) {
      column.children = children;
    } else {
      column.isLeaf = true;
    }
  }
  return columns;
}
// Function to fetch a department by its ID
const getColumnById = async (id) => {
  let sql = 'SELECT * FROM columns WHERE id = ? LIMIT 1';
  let results = await query(sql, [id]);
  if (results.length) {
    return columnObject(results[0]);
  } else {
    return null;
  }
}

const getDepartmentAndUserHierarchy = async (parentId) => {
  const departments = await getListByParentId(parentId);
  for (const department of departments) {
    const departments = await getHierarchy(department.id);
    const users = await getUsersByDepartmentId(department.id);
    const children = departments.concat(users);
    if (children.length) {
      department.children = children;
    } else {
      department.isLeaf = true;
    }
  }
  return departments;
}

const getUsersByDepartmentId = async (departmentId) => {
  let sql = `SELECT * FROM user_departments WHERE departmentId = ?`;
  let results = await query(sql, [departmentId]);

  if (!results.length) {
    return [];
  }

  const userIds = results.map(item => item.user_id);
  const clause = userIds.map(() => "?").join(", ");

  sql = `SELECT * FROM users WHERE id IN (${clause})`;
  results = await query(sql, [departmentId]);

  if (results.length) {
    return results.map(userObject);
  } else {
    return [];
  }
}

// 向部门添加用户
const insertUserToDepartment = async (userId, departmentId) => {
  // 同名检查
  let sql = 'SELECT * FROM user_departments WHERE department_id = ? AND user_id = ?';
  let results = await query(sql, [departmentId, userId]);
  if (results.length > 0) {
    return false;
  }
  sql = 'INSERT INTO user_departments (user_id, department_id) VALUES (?, ?)';
  results = await query(sql, [userId, departmentId]);
  if (results.affectedRows) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  getHierarchy,
  getColumnById,
  getListByParentId,
  insertUserToDepartment,
  getDepartmentAndUserHierarchy,
}