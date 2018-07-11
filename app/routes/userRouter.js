const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// user interactions
router.get('/', UserController.getOwnProfile);
router.get('/:id', UserController.getProfile);
router.patch('/:id', UserController.updateProfile);
router.get('/group/all', UserController.getAllProfiles);
router.get('/group/moderators', UserController.getModeratorProfiles);

module.exports = router;