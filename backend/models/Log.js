const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Log = sequelize.define('Log', {
        action: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        details: { 
            type: DataTypes.TEXT, 
            allowNull: true 
        },
        memberId: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        username: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
    }, {
        // Enable timestamps (createdAt, updatedAt)
        timestamps: true,  
    });
    Log.associate = (models) => {
        Log.belongsTo(models.Member, { foreignKey: 'memberId', as: 'member' });
    };
    return Log;
};
