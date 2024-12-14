const { DataTypes } = require('sequelize');
const fs = require('fs').promises;

module.exports = (sequelize) => {
  const File = sequelize.define('File', {
    originalName: DataTypes.STRING,
    mimeType: DataTypes.STRING,
  });

  File.beforeCreate(async (file) => {
    const fileName = Date.now() + '_' + file.originalname;
    const uploadDir = path.join(__dirname, '../public/uploads');
    
    await fs.mkdirSync(uploadDir, { recursive: true });
    file.filePath = '/uploads/' + fileName;
  });

  return File;
};
