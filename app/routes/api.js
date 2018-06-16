const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200);
    res.send('Hello from API');
    next();
});

router.post('/login', UserController.Login);
router.post('/logout', UserController.Logout);

module.exports = router;
