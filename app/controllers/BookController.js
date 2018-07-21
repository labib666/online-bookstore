const createError = require('http-errors');
const Book = require('../models/Book');
const authenticator = require('../controllers/AuthController');

const validate = authenticator.validate;

const BookController = {
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

    getBook: (req, res, next) => {
        // validate requested id
        validate.isMongoObejectID(req);
        const error = req.validationErrors();
        if (error) {
            const err = createError(404);
            err.message = error[0].msg;

            return next(err);
        }
        
        Book.findById(req.params.id, {
            createdAt: false,
            updatedAt: false
        })
            .catch( (err) => {
                return next(err);
            })
            .then( (book) => {
                if (!book) {
                    const err = createError(404,'book not found');

                    return next(err);
                }
                res.status(200).json({
                    message: 'book retrieved successfully',
                    book: book
                });
                
                return next();
            });
    },
    
    getAllBooks: (req, res, next) => {        
        Book.find(req.params.id, {
            createdAt: false,
            updatedAt: false
        })
            .catch( (err) => {
                return next(err);
            })
            .then( (books) => {
                res.status(200).json({
                    message: 'books retrieved successfully',
                    books: books
                });
                
                return next();
            });
    }
};

module.exports = BookController;
