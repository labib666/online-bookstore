const express = require('express');
const router = express.Router();

// TODO(hasib): Replace this logger with better logger system.
router.use((req, res, next) => {
    console.log(req.method, req.originalUrl);
    next();
});

router.get('/', (req, res) => {
    res.send('Hello from web');
});

module.exports = router;
