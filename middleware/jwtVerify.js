const jwt = require('jsonwebtoken');
const { jwtConfig  } = require('../config/index');
const { hGet  } = require('../redis/index');

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.status = 401;
        this.name = 'UnauthorizedError';
    }
}

module.exports = (req, res, next) => {
    jwt.verify(req.headers.authorization, jwtConfig.secret, async (err, decoded) => {
        console.log(err, decoded, '---------jwt.verify---------')
        if (err) {
            return next(err); // 传递错误给下一个中间件
        }
        // 判断token是否在黑名单中
        const isBlack = await hGet('blackIatList', decoded.iat)
        if (isBlack) {
            return next(new UnauthorizedError("token无效"));
        }
        
        req.auth = decoded
        next()
    })
}