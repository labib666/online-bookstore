const createError = require('http-errors');

const Book = require('../models/Book');
const Category = require('../models/Category');
const authenticator = require('../controllers/AuthController');

const validate = authenticator.validate;

const BookController = {

    /**
     * GET /api/books/
     * Returns all book profiles
     * Expects: {
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: books }    // success
     *      401: {}                 // unauthorized for not logged in user
     *      500: {}                 // internal error
     * }
     */
    getAllBooks: (req, res, next) => {
        // look up books in db
        Book.find(req.params.id, {
            createdAt: false,
            updatedAt: false
        })
            .catch( (err) => {
                return next(err);
            })
            .then( (books) => {
                // respond with book profiles
                res.status(200).json({
                    message: 'books retrieved successfully',
                    books: books
                });
            });
    },

    /**
     * POST /api/books
     * Creates new book
     * Returns new book id
     * Expects: {
     *      body:   title, author, isbn
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: book } // success
     *      401: {}             // unauthorized for not logged in users
     *      403: {}             // forbidden for users with no moderator access
     *      409: {}             // conflict with existing data
     *      422: {}             // invalid data provided
     *      500: {}             // internal error
     * }
     */
    addBook: (req, res, next) => {
        // check if the user has previlige for this
        if (!req.user.isModerator) {
            const err = createError(403, 'user not authorized for this action');

            return next(err);
        }

        // validate and sanitize the incoming data
        validate.title(req);
        validate.author(req);
        validate.ISBN(req);

        const error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(422);
            err.message = error[0].msg;     // return the first error

            return next(err);
        } 
        
        // Credentials are okay
        const title = req.body.title;
        const author = req.body.author;
        const ISBN = req.body.ISBN;

        Book.findOne({ ISBN: ISBN })
            .catch( (err) => {
                return next(err);
            })
            .then( (book) => {
                // same book exists
                if (book) {
                    const err = createError(409,'book already in collection');

                    return next(err);
                }

                // duplicate does not exist. create new book
                Book.create({
                    title: title,
                    author: author,
                    ISBN: ISBN
                })
                    .catch( (err) => {
                        return next(err);
                    })
                    .then( (newBook) => {
                        // new user created
                        // send back the book id
                        res.status(200).json({
                            message: 'book successfully added',
                            book: newBook._id
                        });
                    });
            });
    },

    /**
     * GET /api/books/:id
     * Returns book profile for the given id
     * Expects: {
     *      params: book._id
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: book, categories } // success
     *      401: {}                         // unauthorized for not logged in user
     *      404: {}                         // book not found
     *      500: {}                         // internal error
     * }
     */
    getBook: (req, res, next) => {
        // validate requested id
        validate.isMongoObejectID(req);
        const error = req.validationErrors();
        if (error) {
            const err = createError(404);
            err.message = error[0].msg;

            return next(err);
        }
        
        // request is okay. look up the book
        Book.findById(req.params.id)
            .catch( (err) => {
                return next(err);
            })
            .then( (book) => {
                // book not in db
                if (!book) {
                    const err = createError(404,'book not found');

                    return next(err);
                }
                // book found. find the category it belongs to.
                getBookCategory(book._id)
                    .catch( (err) => {
                        return next(err);
                    })
                    .then( (categories) => {
                    // respond with book profile
                        res.status(200).json({
                            message: 'book retrieved successfully',
                            book: book,
                            categories: categories
                        });
                    });
            });
    },

    /**
     * PATCH /api/books/:id
     * Updates book data
     * Returns book id
     * Expects: {
     *      params: book._id
     *      body:   title (optional), author (optional)
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: user } // success
     *      401: {}             // unauthorized for not logged in user
     *      403: {}             // forbidden (no moderator access, changing isbn )
     *      404: {}             // book not found
     *      422: {}             // invalid data provided
     *      500: {}             // internal error
     * }
     */
    updateBook: (req, res, next) => {
        // validate requested id
        validate.isMongoObejectID(req);
        let error = req.validationErrors();
        if ( error ) {
            const err = createError(404);
            err.message = error[0].msg;

            return next(err);
        }

        // validated book id
        const targetBookID = req.params.id;

        // check if the user has previlige for this
        if (!req.user.isModerator) {
            const err = createError(403, 'user not authorized for this action');

            return next(err);
        }

        // ISBN cannot be changed
        if ('ISBN' in req.body) {
            const err = createError(403, 'ISBN cannot be changed');

            return next(err);
        }

        // validate and sanitize the incoming data
        if ('title' in req.body) {
            validate.title(req);
        }
        if ('author' in req.body) {
            validate.author(req);
        }

        error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(422);
            err.message = error[0].msg;     // return the first error

            return next(err);
        }
        
        Book.findById(targetBookID)
            .catch( (err) => {
                return next(err);
            })
            .then( (targetBook) => {
                // the target book does not exist
                if (!targetBook) {
                    const err = createError(404,'book not found');

                    return next(err);
                }
                // book exists, make necessary changes
                if ('title' in req.body) {
                    targetBook.title = req.body.title;
                }
                if ('author' in req.body) {
                    targetBook.author = req.body.author;
                }
                
                // save changed data in database
                targetBook.save()
                    .catch( (err) => {
                        return next(err);
                    })
                    .then( (updatedBook) => {
                        res.status(200).json({
                            message: 'book updated successfully',
                            book: updatedBook._id
                        });
                    });
            });
    },

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
            const err = createError(403, 'user not authorized for this action');

            return next(err);
        }

        // validate and sanitize the incoming data
        validate.category_name(req);
        validate.isMongoObejectID(req);

        const error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(422);
            err.message = error[0].msg;     // return the first error

            return next(err);
        } 
        
        // Credentials are okay
        const category_name = req.body.category_name;
        const book_id = req.params.id;

        // look whether this book exists in db
        Book.findById(book_id)
            .catch( (err) => {
                return next(err);
            })
            .then( (book) => {
                if (!book) {
                    const err = createError(404,'book not found');

                    return next(err);
                }
                // look for the book in this category
                findBookInCategory(category_name,book_id)
                    .catch( (err) => {
                        return next(err);
                    })
                    .then( (data) => {
                        if (data) {
                            const err = createError(409,'book already exists in this category');

                            return next(err);
                        }
                        // no duplicates found. add book to category
                        Category.create({
                            category_name: category_name,
                            book_id: book_id
                        })
                            .catch( (err) => {
                                return next(err);
                            })
                            .then( (data) => {
                                // send book id back
                                res.status(200).json({
                                    message: 'successfully added book to category',
                                    book: data.book_id
                                });
                            });
                    });
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
            const err = createError(403, 'user not authorized for this action');

            return next(err);
        }

        // validate and sanitize the incoming data
        validate.category_name(req);
        validate.isMongoObejectID(req);

        const error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(422);
            err.message = error[0].msg;     // return the first error

            return next(err);
        } 
        
        // Credentials are okay
        const category_name = req.body.category_name;
        const book_id = req.params.id;

        // look whether this book exists in db
        Book.findById(book_id)
            .catch( (err) => {
                return next(err);
            })
            .then( (book) => {
                if (!book) {
                    const err = createError(404,'book not found');

                    return next(err);
                }
                // look for the book in this category
                findBookInCategory(category_name,book_id)
                    .catch( (err) => {
                        return next(err);
                    })
                    .then( (data) => {
                        if (!data) {
                            const err = createError(404,'book does not belong to this category');

                            return next(err);
                        }
                        // book belongs to category. now remove it
                        Category.findByIdAndRemove(data._id)
                            .catch( (err) => {
                                return next(err);
                            })
                            .then( (deletedData) => {
                                res.status(200).json({
                                    message: 'successfully removed book from category',
                                    book: deletedData.book_id
                                });
                            });
                    });
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
        // validate the category name
        validate.category_name(req);
        let error = req.validationErrors();
        if ( error ) {
            const err = createError(404);
            err.message = error[0].msg;

            return next(err);
        }

        // request is okay. look up the books
        Category.distinct('book_id', {category_name: req.params.category_name})
            .catch( (err) => {
                return next(err);
            })
            .then( (entries) => {
                let promises = [];
                entries.forEach((entry) => {
                    promises.push(Book.findById(entry));
                });
                // once we have all the book data, respond to query
                Promise.all(promises)
                    .catch( (err) => {
                        return next(err);
                    })
                    .then( (books) => {
                        res.status(200).json({
                            message: 'successfully retrieved books of given category',
                            books: books
                        });
                    });
            });
    }
    
};

/**
 * looks up whether the book exists in category or not
 * @param {string} category_name    // The category name to look inside
 * @param {string} book_id          // The book to look up
 */
const findBookInCategory = (category_name, book_id) => {
    return new Promise( (resolve, reject) => {
        Category.findOne({
            category_name: category_name,
            book_id: book_id
        })
            .catch( (err) => {
                reject(err);
            })
            .then( (data) => {
                resolve(data);
            });
    });
};

/**
 * Returns the categories book belongs to
 * @param {string} targetBookID         // id of book to look up
 */
const getBookCategory = (targetBookID) => {
    return new Promise( (resolve, reject) => {
        Category.find({
            book_id: targetBookID
        })
            .catch( (err) => {
                reject(err);
            })
            .then( (entries) => {
                let categories = [];
                entries.forEach( (entry) => {
                    categories.push(entry.category_name);
                });
                resolve(categories);
            });
    });
};

module.exports = BookController;
