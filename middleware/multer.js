// ==========================
// MULTER FILTER ROUTE
// ==========================

var multer = require('multer');

// Set file name
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

// Restrict file types
var imageFilter = function (req, file, callback) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        req.fileValidationError = 'Only image files (.jpg .jpeg .png) are allowed';
        return callback(null, false);
    }
    callback(null, true);
};

// // Limit file size
// var imageMaxSize = function (req, file, cb) {
//     // accept image smaller than 5MB only
//     if (file.size > 5242880) {
//         return cb(new Error('Image is too large (Max size 5MB)'), false);
//     }
//     cb(null, true);
// };

var upload = multer({
    storage: storage, 
    fileFilter: imageFilter,
    //limits: { fileSize: imageMaxSize } //5.24MB
});

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = upload;