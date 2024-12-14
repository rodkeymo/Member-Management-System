const multer = require('multer');
const path = require('path');

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the folder where profile pictures will be stored
    cb(null, 'uploads/profile_pictures');
  },
  filename: (req, file, cb) => {
    // Set the filename as the current timestamp to avoid name conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save with original file extension
  },
});

// Check if uploaded file is an image
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .png, .jpg files are allowed'), false);
  }
};

// Initialize Multer with storage and file filter
const upload = multer({ storage, fileFilter });

module.exports = upload;
