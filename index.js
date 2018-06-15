const express = require('express');
const app = express();

const router = require('./routes/index');
router(app);

app.listen(3000, () => {
    console.log('App running on port 3000.');
});
