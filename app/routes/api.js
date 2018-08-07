const express = require('express');
const createError = require('http-errors');

const UserController = require('../controllers/UserController');
const auth = require('../controllers/AuthController');
const vc = auth.validatorChain;

const userRouter = require('./userRouter');
const bookRouter = require('./bookRouter');

const HttpNotFound = (req, res, next) => {
    return next(createError(404, 'Not Found'));
};

const router = express.Router();

// hello world
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello from API'
    });
});

// authentication
router.post('/register', auth.loggedOut, vc.register(), UserController.register);
router.post('/login', auth.loggedOut, vc.login(), UserController.login);
router.post('/social/google', auth.loggedOut, vc.googleLogin(), UserController.googleLogin);
router.post('/social/facebook', auth.loggedOut, vc.googleLogin(), UserController.facebookLogin);

// request from logged-in user
router.post('/logout', auth.loggedIn, UserController.logout);
router.use('/users', auth.loggedIn, userRouter);
router.use('/books', auth.loggedIn, bookRouter);

// could not find a good route. httpnotfound
router.use(HttpNotFound);

module.exports = router;
