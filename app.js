const express = require('express');
const app = express();
const dotenv = require('dotenv');
const chalk = require('chalk');
const path = require('path');
const routes = require('./app/routes/index');
const dbconnection = require('./database/dbconnection');

// Importing Environment variables from .env file

const dotenvParsed = dotenv.config();
if(dotenvParsed.error) {
    throw dotenvParsed.error;
}
console.log('Environment variables:', chalk.bold(JSON.stringify(dotenvParsed.parsed, null, 4)));

// Add body parser and public assets
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use routes

app.use(routes);

// Start database connection

dbconnection.dbconnect();

// Start the node server

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
