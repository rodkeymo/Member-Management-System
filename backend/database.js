const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Database connected.'))
    .catch(err => console.error('Database connection error:', err));

module.exports = sequelize;
