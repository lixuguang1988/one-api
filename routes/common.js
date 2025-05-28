const express = require('express');
const { query } = require('../database/db');
const jwtVerify = require('../middleware/jwtVerify');
const multer = require('multer');
const domain = 'http://localhost:3000';

// 设置文件存储路径和文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // 文件存储路径
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // 文件名
  },
});
const getUrl = (file) => {
  return domain + '/uploads/' + file.filename;
};

const upload = multer({ storage: storage });

const router = express.Router();

// 单文件上传
router.post('/upload', jwtVerify, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({
    code: 200,
    message: 'File uploaded successfully',
    data: {
      ...req.file,
      url: getUrl(req.file),
    },
  });
});

// 多文件上传
router.post('/upload-multiple', upload.array('files', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(200).json({ code: 500, message: 'No files uploaded' });
  }
  res.status(200).json({
    code: 200,
    message: 'Files uploaded successfully',
    data: req.files.map((item) => {
      return {
        ...item,
        url: getUrl(item.file),
      };
    }),
  });
});

module.exports = router;
