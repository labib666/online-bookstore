const express = require('express');

const chalk = require('chalk');
const createError = require('http-errors');
const bearerToken = require('express-bearer-token');

const dbconnection = require('../../database/dbconnection');
const auth = require('../controllers/AuthController');

const web = require('./web');
const api = require('./api');

const databaseConnected = (req,res,next) => {
    const connected = dbconnection.isOnline();
    if (connected) {
        return next();
    } else {
        return next(createError('500', 'Internal Server Error'));
    }
};

const HttpNotFound = (req, res, next) => {
    res.redirect('/');
    
    return next();
};

const ErrorHandler = (err, req, res, next) => {
    res.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    console.log(chalk.red(err.status,err.message));

    res.json({
        message: err.message
    });

    return next();
};

const router = express.Router();

// make sure database is connected
router.use(databaseConnected);

// bind the user detail to req
router.use(bearerToken());
router.use(auth.getUserData);

router.use('/', web);
router.use('/api', api);
router.use(HttpNotFound);
router.use(ErrorHandler);

module.exports = router;
