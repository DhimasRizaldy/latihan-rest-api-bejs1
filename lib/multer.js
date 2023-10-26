const multer = require('multer');
const path = require('path');

// fungsi generateStorage File (peyimpanan lokal)
function generateStorage(props) {
  let { location, allowedMimeTypes } = props;
  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, location);
      },
      filename: function (req, file, cb) {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        const err = new Error(`only ${allowedMimeTypes.join(',')} allowed to upload!`);
        return callback(err, false);
      }
      callback(null, true);
    },
    onError: (err, next) => {
      next(err);
    }
  });
}

// fungsi generateFilter File (penyimapanan cloud imagekit)
function generateFilter(props) {
  let { allowedMimeTypes } = props;
  return multer({
    fileFilter: (req, file, callback) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        const err = new Error(`only ${allowedMimeTypes.join(', ')} allowed to upload!`);
        return callback(err, false);
      }
      callback(null, true);
    },
    onError: (err, next) => {
      next(err);
    }
  });
}

module.exports = {
  image: generateFilter({
    allowedMimeTypes: ['image/png', 'image/jpeg']
  })
}