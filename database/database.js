const Sequelize = require("sequelize");
const connection = new Sequelize('users_system','root','clarinha',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;