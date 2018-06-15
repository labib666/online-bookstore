const express = require('express');
const web = require('./web');
const api = require('./api');
const chalk = require('chalk');

const HttpNotFound = (req, res) => {
    console.log(chalk.red.bold(req.method, req.originalUrl, ' - 404 Not found'));
    res.send('<center><h1>404 Not found</h1></center>');
};

const Logger = (req, res, next) => {
    const time = new Date();
    console.log(chalk.bold(time.toISOString(), req.method), req.originalUrl);
    next();
};

const router = express.Router();
router.use(Logger);
router.use('/api', api);
router.use('/', web);
router.all('*', HttpNotFound);

module.exports = router;
