const express = require('express');
const web = require('./web');
const api = require('./api');
const chalk = require('chalk');

const HttpNotFound = (req, res, next) => {
    if(!res.headersSent) {
        res.status(404);
        res.send('<center><h1>404 Not found</h1></center>');
    }
    next();
};

const Logger = (req, res, next) => {
    const time = new Date();
    console.log(chalk.bold(time.toISOString(), req.method, res.statusCode), req.originalUrl);
    next();
};

const router = express.Router();

router.use('/api', api);
router.use('/', web);
router.use(HttpNotFound);
router.use(Logger);

module.exports = router;
