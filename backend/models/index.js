const { Sequelize } = require('sequelize');
const User = require('./User');
const Role = require('./Role');
const Member = require('./Member');
const Log = require('./log');
  
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

const models = {
  User: User(sequelize),
  Role: Role(sequelize),
  Member: Member(sequelize),
  Log: Log(sequelize),
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = { sequelize, ...models };
