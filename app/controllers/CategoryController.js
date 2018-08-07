const createError = require('http-errors');

const Book = require('../models/Book');
const Category = require('../models/Category');
const BC = require('./BookController');

const CategoryController = {

    /**
     * POST /api/books/:id/category
     * Adds a book to a category
     * Returns the book id
     * Expects: {
     *      params: book._id
     *      body:   category_name
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: book } // success
     *      401: {}             // unauthorized for not logged in users
     *      403: {}             // forbidden for users with no moderator access
     *      404: {}             // book not found
     *      409: {}             // conflict with existing data
     *      422: {}             // invalid data provided
     *      500: {}             // internal error
     * }
     */
    addToCategory: (req, res, next) => {
        // check if the user has previlige for this
        if (!req.user.isModerator) {
            return next(createError(403, 'user not authorized for this action'));
        }
        
        // Credentials are okay
        const category_name = req.body.category_name;
        const book_id = req.params.id;

        // look whether this book exists in db
        Book.findById(book_id)
            .then( (book) => {
                if (!book) {
                    return next(createError(404,'book not found'));
                }
                // look for the book in this category
                Category.findOne({
                    category_name: category_name,
                    book_id: book_id
                })
                    .then( (data) => {
                        if (data) {
                            return next(createError(409,'book already exists in this category'));
                        }
                        // no duplicates found. add book to category
                        Category.create({
                            category_name: category_name,
                            book_id: book_id
                        })
                            .then( (data) => {
                                // send book id back
                                res.status(200).json({
                                    message: 'successfully added book to category',
                                    book: data.book_id
                                });
                            })
                            .catch( (err) => {
                                return next(err);
                            });
                    })
                    .catch( (err) => {
                        return next(err);
                    });
            })
            .catch( (err) => {
                return next(err);
            });
    },

    /**
     * DELETE /api/books/:id/category
     * Removes a book from a category
     * Returns the book id
     * Expects: {
     *      params: book._id
     *      body:   category_name
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: book } // success
     *      401: {}             // unauthorized for not logged in users
     *      403: {}             // forbidden for users with no moderator access
     *      404: {}             // book not found
     *      422: {}             // invalid data provided
     *      500: {}             // internal error
     * }
     */
    removeFromCategory: (req, res, next) => {
        // check if the user has previlige for this
        if (!req.user.isModerator) {
            return next(createError(403, 'user not authorized for this action'));
        }
        
        // Credentials are okay
        const category_name = req.body.category_name;
        const book_id = req.params.id;

        // look whether this book exists in db
        Book.findById(book_id)
            .then( (book) => {
                if (!book) {
                    return next(createError(404,'book not found'));
                }
                // look for the book in this category
                Category.findOne({
                    category_name: category_name,
                    book_id: book_id
                })
                    .then( (data) => {
                        if (!data) {
                            return next(createError(404,'book does not belong to this category'));
                        }
                        // book belongs to category. now remove it
                        Category.findByIdAndRemove(data._id)
                            .then( (deletedData) => {
                                res.status(200).json({
                                    message: 'successfully removed book from category',
                                    book: deletedData.book_id
                                });
                            })
                            .catch( (err) => {
                                return next(err);
                            });
                    })
                    .catch( (err) => {
                        return next(err);
                    });
            })
            .catch( (err) => {
                return next(err);
            });
    },

    /**
     * GET /api/books/category/names
     * Fetches all the category names
     * Expects: {
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: categories }   // success
     *      401: {}                     // unauthorized for not logged in users
     *      500: {}                     // internal error
     * }
     */
    getCategoryNames: (req,res,next) => {
        // look up the category names
        Category.distinct('category_name')
            .then( (categories) => {
                // respond with the names
                res.json({
                    message: 'successfully retrieved category names',
                    categories: categories
                });
            })
            .catch( (err) => {
                return next(err);
            });
    },

    /**
     * GET /api/books/category/:category_name
     * Fetches all the books from the given category
     * Expects: {
     *      params: category_name
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: books }    // success
     *      401: {}                 // unauthorized for not logged in users
     *      404: {}                 // category not found
     *      500: {}                 // internal error
     * }
     */
    getBooksInCategory: (req, res, next) => {
        // request is okay. look up the books
        Category.distinct('book_id', {category_name: req.params.category_name})
            .then( (entries) => {
                BC.getBookProfiles(entries)
                    .then((books) => {
                        res.status(200).json({
                            message: 'successfully retrieved books of given category',
                            books: books
                        });
                    })
                    .catch( (err) => {
                        return next(err);
                    });
            })
            .catch( (err) => {
                return next(err);
            });
    }
};

module.exports = CategoryController;
