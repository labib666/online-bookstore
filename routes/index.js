const web = require('./web');
const api = require('./api');

const HttpNotFound = (req, res) => {
    console.log(req.method, req.originalUrl);
    res.send('<center><h1>404 Not found</h1></center>');
}

const router = (app) => {
    app.use('/api', api);
    app.use('/', web);
    app.all('*', HttpNotFound);
}

module.exports = router;
