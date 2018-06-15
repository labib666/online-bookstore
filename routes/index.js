const web = require('./web');
const api = require('./api');
const chalk = require('chalk');

const HttpNotFound = (req, res) => {
    console.log(chalk.red.bold(req.method, req.originalUrl, ' - 404 Not found'));
    res.send('<center><h1>404 Not found</h1></center>');
};

const router = (app) => {
    app.use('/api', api);
    app.use('/', web);
    app.all('*', HttpNotFound);
};

module.exports = router;
