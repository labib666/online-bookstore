const express = require('express');
const chalk = require('chalk');

const router = express.Router();

// TODO(hasib): Replace this logger with better logger system.
router.use((req, res, next) => {
    console.log(chalk.bold(req.method), req.originalUrl);
    next();
});

router.get('/', (req, res) => {
    res.send('Hello from web');
});

module.exports = router;
