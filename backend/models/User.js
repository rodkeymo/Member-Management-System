// models/user.js (updated)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        roleId: { type: DataTypes.INTEGER, allowNull: false },
    });

    User.associate = (models) => {
        User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
        User.hasOne(models.Member, { foreignKey: 'userId', as: 'member' });
    };

User.addHook('afterCreate', async (user, options) => {
  const { Member, Log } = sequelize.models;
  try {
    // Create a Member linked to the User
    const member = await Member.create({
      username: user.username,
      email: user.email,
      userId: user.id,
    });

    // Ensure the member is created before creating the log
    if (!member || !member.id) {
      throw new Error('Failed to create Member: member ID is null or undefined');
    }

    // Create a Log entry linked to the created Member
    await Log.create({
      action: 'User Created',
      details: `Member ${member.username} created}`,
      memberId: member.id, // Use the correct member ID
      username: member.username
    });
  } catch (error) {
    console.error('Error in afterCreate hook:', error.message);
    throw error; // Re-throw the error so it can be handled upstream
  }
});
   
    return User;
};
