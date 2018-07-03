const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/', (req, res, next) => {
    res.status(200);
    res.json({
        message: 'Hello from API'
    });
    next();
});

router.post('/register', UserController.Register);
router.post('/login', UserController.Login);
router.post('/logout', UserController.Logout);

module.exports = router;
