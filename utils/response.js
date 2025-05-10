
module.exports = {
    buildPageList(data, page, pageSize, total) {
        return {
            data,
            page,
            pageSize,
            total
        }
    },
    buildSuccess(res, data) {
        return res.status(200).json({ 
            code: 200,
            message: '暂无数据',
            data: null
          });
    },
}