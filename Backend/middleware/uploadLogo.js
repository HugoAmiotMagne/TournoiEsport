const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'logos');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `logo-${Date.now()}${ext}`);
  }
});

const multerInstance = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Fichier invalide'));
    }
    cb(null, true);
  }
});

const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo

// Middleware capable de gérer soit un upload multipart (`file`), soit
// un logo envoyé en Base64 dans `req.body.logo`.
module.exports = function (req, res, next) {
  try {
    const logo = req.body && req.body.logo;
    if (logo && /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(logo)) {
      const base64Data = logo.split(',')[1] || '';
      const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
      if (sizeInBytes > MAX_SIZE) {
        return res.status(400).json({ message: 'Le logo ne doit pas dépasser 2 Mo' });
      }

      const match = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.exec(logo);
      const ext = match[1] === 'jpeg' ? '.jpg' : `.${match[1]}`;
      const filename = `logo-${Date.now()}${ext}`;
      const filePath = path.join(UPLOAD_DIR, filename);
      fs.writeFileSync(filePath, base64Data, 'base64');

      req.file = {
        fieldname: 'logo',
        originalname: filename,
        encoding: '7bit',
        mimetype: `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}`,
        destination: path.relative(process.cwd(), UPLOAD_DIR).replace(/\\/g, '/'),
        filename,
        path: path.join('uploads', 'logos', filename).replace(/\\/g, '/'),
        size: sizeInBytes
      };

      // Supprimer la donnée Base64 du body pour éviter une double-gestion
      delete req.body.logo;
      return next();
    }

    // Pas de Base64 : déléguer à multer pour gérer un upload multipart
    multerInstance.single('logo')(req, res, next);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur lors du traitement du logo', error: err.message });
  }
};