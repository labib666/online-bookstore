const express = require('express');

const UserController = require('../controllers/UserController');
const BookingController = require('../controllers/BookingController');

const router = express.Router();

// user interactions
router.get('/', UserController.getAllProfiles);
router.get('/me', UserController.getOwnProfile);
router.get('/:id', UserController.getProfile);
router.patch('/:id', UserController.updateProfile);
router.get('/:id/bookings', BookingController.getBookingsByUser);

module.exports = router;