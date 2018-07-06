const mongoose = require('mongoose');
const chalk = require('chalk');

const dbErrorHandler = (err) => {
    // Comment out the following line to avoid logging db errors
    console.log('Database Connection Error:', chalk.bold(JSON.stringify(err, null, 4)));
};

function connect () {
    mongoose.connect(process.env.DB_URI).then(
        () => {},
        (err) => {
            dbErrorHandler(err);
        }
    );

    return mongoose.connection;
}

const dbconnection = {
    dbconnect: () => {
        connect()
            .on('error', dbErrorHandler)
            .on('connected', () => {
                console.log(chalk.bold('Connected to Database on'), process.env.DB_URI);
            })
            .on('disconnected', connect);
    },
    dbclose: (cb) => {
        mongoose.connection.close( () => {
            cb();
        });
    },
    isOnline: () => {
        return (mongoose.connection.readyState === 1);
    }
};

module.exports = dbconnection;
