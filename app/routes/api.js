const express = require('express');
const expressValidator = require('express-validator');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Hello from API'
    });
    
    return next();
});

router.post('/register', expressValidator(), UserController.Register);
router.post('/login', expressValidator(), UserController.Login);
router.post('/logout', UserController.Logout);
router.get('/user', UserController.getProfile);

module.exports = router;
