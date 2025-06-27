const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;


// CLOUDINARY_CLOUD_NAME = dpi07f3np
// CLOUDINARY_API_KEY = 622239944131588
// CLOUDINARY_API_SECRET = 5lTguZ2BfQmh48tnfkQ7zXDzrZI