// configure and export multer
const multer = require('multer')

// config for storing the images through multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // error, destination
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    // error, file name
    cb(null, Date.now() + file.originalname);
  },
});

// config for filtering files by their mimetype
const fileFilter = (req, file, cb) => {
  file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
    ? cb(null, true)
    : cb(null, false);
};

// init the multer, passing in an object will set its config
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1920 * 1920 * 5,
  },
  fileFilter: fileFilter,
});

module.exports = upload;