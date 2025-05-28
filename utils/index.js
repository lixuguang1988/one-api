const crypto = require('crypto');

// 密码哈希函数
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = {
  hashPassword,
};
