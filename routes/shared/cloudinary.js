// ==========================
// CLOUDINARY IMPORT ROUTE
// ==========================

var cloudinaryConf = { 
    cloud_name: 'amovos', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
};


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = cloudinaryConf;