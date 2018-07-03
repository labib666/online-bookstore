const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const createError = require('http-errors');
const dbconnection = require('../../database/dbconnection');

const web = require('./web');
const api = require('./api');

const databaseConnected = (req,res,next) => {
    const connected = dbconnection.isOnline();
    if (connected) {
        next();
    }
    else {
        const err = createError('500', '500 Internal Server Error');
        next(err);
    }
};

const HttpNotFound = (req, res, next) => {
    if (!res.headersSent) {
        const err = createError(404, '404 Not Found');
        next(err);
    }
    else {
        next();
    }
};

const Logger = (req, res, next) => {
    const time = new Date();
    console.log(chalk.bold(time.toISOString(), req.method, res.statusCode), req.originalUrl);
    next();
};

const ErrorHandler = (err, req, res, next) => {
    res.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({
        message: err.message
    });
    next(err);
};

const ErrorLogger = (err, req, res, next) => {
    const time = new Date();
    console.log(chalk.bold(time.toISOString(), req.method, res.statusCode), req.originalUrl);
    console.log(chalk.red(err.status,err.message));
    next();
};

// make sure database is connected
router.use(databaseConnected);

router.use('/', web);
router.use('/api', api);
router.use(HttpNotFound);
router.use(Logger);
router.use(ErrorHandler);
router.use(ErrorLogger);

module.exports = router;
