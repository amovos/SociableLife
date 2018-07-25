// ==========================
// MULTER FILTER ROUTE
// ==========================

var multer = require('multer');

// Set file name
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + "-" + (Math.floor(Math.random()*90000) + 10000));
  }
});

// Restrict file types
var imageFilter = function (req, file, callback) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
        req.fileValidationError = 'Only image files (.jpg .jpeg .png .webp) are allowed';
        return callback(null, false);
    }
    callback(null, true);
};

var upload = multer({
    storage: storage,
    limits: { fileSize: 10485760 }, //10MB (error handled in app.js)
    fileFilter: imageFilter
});

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = upload;