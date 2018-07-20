const express = require('express');
const BookController = require('../controllers/BookController');

const router = express.Router();

// user interactions
router.post('/', BookController.addBook);
router.get('/:id', BookController.getBook);
router.patch('/:id', BookController.updateBook);
router.get('/group/all', BookController.getAllBooks);

module.exports = router;