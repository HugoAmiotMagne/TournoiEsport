const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/logos',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`);
  }
});

module.exports = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Fichier invalide'));
    }
    cb(null, true);
  }
});