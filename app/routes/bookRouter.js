const express = require('express');

const BookController = require('../controllers/BookController');
const BookingController = require('../controllers/BookingController');

const router = express.Router();

// user interactions
router.get('/', BookController.getAllBooks);
router.post('/', BookController.addBook);
router.get('/bookings', BookingController.getAllBooking);
router.get('/bookings/:status', BookingController.getBookingsWithStatus);
router.patch('/bookings/:id', BookingController.updateBooking);
router.get('/category/:category_name', BookController.getBooksInCategory);
router.get('/:id', BookController.getBook);
router.patch('/:id', BookController.updateBook);
router.get('/:id/bookings', BookingController.getBookingsForBook);
router.post('/:id/bookings', BookingController.addBooking);
router.post('/:id/category', BookController.addToCategory);
router.delete('/:id/category', BookController.removeFromCategory);

module.exports = router;