const express = require('express');

const path = require('path');
const chalk = require('chalk');
const morgan = require('morgan');
const dotenv = require('dotenv');

const dbconnection = require('./database/dbconnection');

// Importing Environment variables from .env file

const dotenvParsed = dotenv.config();
if(dotenvParsed.error) {
    console.error(chalk.bold('.env file not found!'));
}
console.log('Environment variables from .env:', chalk.bold(JSON.stringify(dotenvParsed.parsed, null, 4)));

const routes = require('./app/routes/index');
const app = express();

// Add logger, body parser and public assets
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use routes

app.use(routes);

// Start database connection

dbconnection.dbconnect();

// Close DB connection when process ends

process.on('SIGINT', () => {
    dbconnection.dbclose( () => {
        console.log(chalk.bold('Database connection closed'));
        process.exit(0);
    });
});

// Start the node server

module.exports = app.listen(process.env.PORT, () => {
    console.log(chalk.bold(`App running on port ${process.env.PORT}.`));
});
