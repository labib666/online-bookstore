const express = require('express');

const auth = require('../controllers/AuthController');
const UC = require('../controllers/UserController');
const BKC = require('../controllers/BookingController');
const RC = require('../controllers/RatingController');

const vc = auth.validatorChain;

const router = express.Router();

// user interactions
router.get('/', UC.getAllProfiles);
router.post('/search', vc.search(), UC.searchUser);
router.get('/me', UC.getOwnProfile);
router.get('/me/bookings', BKC.getBookingsByUser);
router.get('/me/ratings', RC.getRatingsByUser);
router.get('/:id', vc.checkID(), UC.getProfile);
router.patch('/:id', vc.checkID(), vc.updateProfile(), UC.updateProfile);

module.exports = router;