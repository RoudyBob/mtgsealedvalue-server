const express = require('express');
const sequelizeConnection = require('./db');

const app = express();
require('dotenv').config();

// Import JSON support for Express
app.use(express.json());

// Header configuration for client requests
app.use(require('./middleware/headers'));

// Import controllers as a bundle
const controllers = require("./controllers");

// Controllers used by the backend
app.use('/user', controllers.User);
app.use('/product', controllers.Product);

// Connect to DB
sequelizeConnection.sync();
//sequelize.sync({force: true});  // If we need to force a DB change

app.listen(process.env.PORT, function(){
    console.log('🚀 server started at http://localhost:' + process.env.PORT);
})