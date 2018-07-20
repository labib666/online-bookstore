const express = require('express');
const createError = require('http-errors');
const UserController = require('../controllers/UserController');
const authenticator = require('../controllers/AuthController');

const userRouter = require('./userRouter');
const bookRouter = require('./bookRouter');

const router = express.Router();

const HttpNotFound = (req, res, next) => {
    if (!res.headersSent) {
        const err = createError(404, '404 Not Found');

        return next(err);
    } else {
        return next();
    }
};

// hello world
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Hello from API'
    });
    
    return next();
});

// authentication
router.post('/register', authenticator.loggedOut, UserController.register);
router.post('/login', authenticator.loggedOut, UserController.login);
router.post('/logout', authenticator.loggedIn, UserController.logout);

// request regarding user
router.use('/user', authenticator.loggedIn, userRouter);
router.use('/book', authenticator.loggedIn, bookRouter);

// could not find a good route. httpnotfound
router.use(HttpNotFound);

module.exports = router;
