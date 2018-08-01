const express = require('express');

const BookController = require('../controllers/BookController');
const BookingController = require('../controllers/BookingController');

const router = express.Router();

// user interactions
router.get('/', BookController.getAllBooks);
router.post('/', BookController.addBook);
router.post('/search', BookController.searchBook);
router.get('/bookings', BookingController.getAllBookings);
router.patch('/bookings/:id', BookingController.updateBooking);
router.get('/bookings/:status', BookingController.getBookingsWithStatus);
router.get('/category/:category_name', BookController.getBooksInCategory);
router.get('/:id', BookController.getBook);
router.patch('/:id', BookController.updateBook);
router.post('/:id/bookings', BookingController.addBooking);
router.post('/:id/category', BookController.addToCategory);
router.delete('/:id/category', BookController.removeFromCategory);
router.get('/:id/bookings', BookingController.getAllBookingsForBook);
router.get('/:id/bookings/me', BookingController.getUserBookingsForBook);

module.exports = router;