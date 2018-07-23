const createError = require('http-errors');
const Book = require('../models/Book');
const authenticator = require('../controllers/AuthController');

const validate = authenticator.validate;

const BookController = {
    /**
     * POST /api/book
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
     *      422: {}             // invalid data provided
     *      409: {}             // conflict with existing data
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

                        return next();
                    });
            });
    },

    /**
     * PATCH /api/book/:id
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

                        return next();
                    });
            });
    },

    /**
     * GET /api/book/:id
     * Returns book profile for the given id
     * Expects: {
     *      params: book._id
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: book } // success
     *      401: {}             // unauthorized for not logged in user
     *      404: {}             // book not found
     *      500: {}             // internal error
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
        Book.findById(req.params.id, {
            createdAt: false,
            updatedAt: false
        })
            .catch( (err) => {
                return next(err);
            })
            .then( (book) => {
                // book not in db
                if (!book) {
                    const err = createError(404,'book not found');

                    return next(err);
                }
                // respond with book profile
                res.status(200).json({
                    message: 'book retrieved successfully',
                    book: book
                });
                
                return next();
            });
    },
    
    /**
     * GET /api/book/group/all
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
                
                return next();
            });
    }
};

module.exports = BookController;
