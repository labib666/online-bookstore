const express = require('express');

const BookController = require('../controllers/BookController');

const router = express.Router();

// user interactions
router.get('/', BookController.getAllBooks);
router.post('/', BookController.addBook);
router.get('/:id', BookController.getBook);
router.patch('/:id', BookController.updateBook);
router.post('/:id/category', BookController.addToCategory);

module.exports = router;