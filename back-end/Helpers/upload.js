const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Config/cloudnary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: './Uploads', // pasta no Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

module.exports = upload;