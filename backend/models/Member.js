const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Member = sequelize.define('Member', {
        // Inheriting username and email from User table
        username: { 
            type: DataTypes.STRING, 
            allowNull: true, 
            unique: true 
        },
        email: { 
            type: DataTypes.STRING, 
            allowNull: true, 
            unique: true 
        },
        bio: { 
            type: DataTypes.TEXT, 
            allowNull: true 
        },
        mobile: { 
          type: DataTypes.STRING, 
          allowNull: true 
      },
        title: { 
            type: DataTypes.STRING, 
            allowNull: true 
        },
        profilePicture: { 
            type: DataTypes.STRING, 
            allowNull: true 
        },
        userId: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
    });

    Member.associate = (models) => {
        // Associations
        Member.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Member.hasMany(models.Log, { foreignKey: 'memberId', as: 'logs' });
    };

    return Member;
};
