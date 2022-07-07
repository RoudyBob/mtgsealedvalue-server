const { Sequelize }  = require('sequelize');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

const sequelizeConnection = new Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectOptions: {
        useUTC: true
    },
});

sequelizeConnection.authenticate().then(
    function() {
        console.log('Connected to MTGSealedValue PostgreSQL database.');
    },
    function(err) {
        console.log(err);
    }
);

module.exports = sequelizeConnection;