const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200);
    res.json({
        message: 'Hello from web'
    });
    next();
});

module.exports = router;
