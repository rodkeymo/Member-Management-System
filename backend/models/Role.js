const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING },
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users' });
  };

  return Role;
};
