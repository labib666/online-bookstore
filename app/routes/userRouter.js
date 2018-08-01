const express = require('express');

const UserController = require('../controllers/UserController');
const BookingController = require('../controllers/BookingController');

const router = express.Router();

// user interactions
router.get('/', UserController.getAllProfiles);
router.post('/search', UserController.searchUser);
router.get('/me', UserController.getOwnProfile);
router.get('/me/bookings', BookingController.getBookingsByUser);
router.get('/:id', UserController.getProfile);
router.patch('/:id', UserController.updateProfile);

module.exports = router;