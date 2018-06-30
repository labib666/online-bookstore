const dotenv = require('dotenv');
const express = require('express');
const chalk = require('chalk');
const dbconnection = require('./database/dbconnection');

// Importing Environment variables from .env file

const dotenvParsed = dotenv.config();
if(dotenvParsed.error) {
    throw dotenvParsed.error;
}
console.log('Environment variables:', chalk.bold(JSON.stringify(dotenvParsed.parsed, null, 4)));

// Start database connection

dbconnection.dbconnect();

// Start the node server

const app = express();
const routes = require('./app/routes/index');
app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}.`);
});

// Close DB connection when process ends

process.on('SIGINT', () => {
    dbconnection.dbclose( () => {
        console.log(chalk.bold('Database connection closed'));
        process.exit(0);
    });
});
