const express = require('express');
const chalk = require('chalk');
const createError = require('http-errors');
const bearerToken = require('express-bearer-token');
const dbconnection = require('../../database/dbconnection');
const authenticate = require('../controllers/AuthController');

const web = require('./web');
const api = require('./api');

const databaseConnected = (req,res,next) => {
    const connected = dbconnection.isOnline();
    if (connected) {
        return next();
    } else {
        const err = createError('500', '500 Internal Server Error');

        return next(err);
    }
};

const CORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    return next();
};

const HttpNotFound = (req, res, next) => {
    if (!res.headersSent) {
        const err = createError(404, '404 Not Found');

        return next(err);
    } else {
        return next();
    }
};

const Logger = (req, res, next) => {
    const time = new Date();
    console.log(chalk.bold(time.toISOString(), req.method, res.statusCode), req.originalUrl);

    return next();
};

const ErrorHandler = (err, req, res, next) => {
    res.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({
        message: err.message
    });

    return next(err);
};

const ErrorLogger = (err, req, res, next) => {
    const time = new Date();
    console.log(chalk.bold(time.toISOString(), req.method, res.statusCode), req.originalUrl);
    console.log(chalk.red(err.status,err.message));

    return next();
};

const router = express.Router();
router.use(CORS);

// make sure database is connected
router.use(databaseConnected);

// bind the user detail to req
router.use(bearerToken());
router.use(authenticate.getUserData, authenticate.failedJWT);

router.use('/', web);
router.use('/api', api);
router.use(HttpNotFound);
router.use(Logger);
router.use(ErrorHandler);
router.use(ErrorLogger);

module.exports = router;
