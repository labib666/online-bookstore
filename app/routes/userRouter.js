const express = require('express');

const UserController = require('../controllers/UserController');

const router = express.Router();

// user interactions
router.get('/', UserController.getAllProfiles);
router.get('/me', UserController.getOwnProfile);
router.get('/:id', UserController.getProfile);
router.patch('/:id', UserController.updateProfile);

module.exports = router;