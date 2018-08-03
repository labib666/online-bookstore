const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const checkLib = require('express-validator/check');
const sanitizeLib = require('express-validator/filter');

const check = checkLib.check;
const sanitize = sanitizeLib.sanitize;
const validationResult = checkLib.validationResult;

const Token = require('../models/Token');
const User = require('../models/User');
const Book = require('../models/Book');
const Booking = require('../models/Booking');

const AuthController = {
    /**
     * Get user's information from the bearer token
     * Binds 'user' attribute to 'req'
     * req.user = null when missing/invalid bearer token
     */
    getUserData: (req, res, next) => {
        // user did not send a token
        if (!req.token) {
            req.user = null;

            return next();
        } 

        // verify the payload
        // payload contains decoded token
        let payload;
        const jwtSecret = process.env.JWT_SECRET;
        const jwtOptions = {
            ignoreExpiration: false
        };
        
        try {
            payload = JWT.verify(req.token, jwtSecret, jwtOptions);
        } catch (err) {
            // invalid JWT. Ignore it.
            req.user = null;
            
            return next();
        }

        // see if the token exists in database
        Token.findOne({ token: req.token })
            .then( (token) => {
                // no such token exists. user is logged out
                if (!token) {
                    req.user = null;

                    return next();
                }

                // if all is ok, attach the user id to req
                req.user = payload;

                // change the token to its id in token table
                req.token = token._id;

                return next();
            })
            .catch( (err) => {
                return next(err);
            });
    },

    /**
     * Middleware that only allows logged in users to pass
     * Responds:
     *      401: {}     // unauthorized for not logged in users
     */
    loggedIn: (req, res, next) => {
        // user is not logged in?
        if (!req.user) {
            return next(createError(401, 'user not logged in'));
        } else {
            return next();
        }
    },

    /**
     * Middleware that only allows not logged in users to pass
     * Responds:
     *      403: {}     // forbidden for logged in users
     */
    loggedOut: (req, res, next) => {
        // user is logged in?
        if (req.user) {
            return next(createError(403, 'user already logged in'));
        } else {
            return next();
        }
    },

    validatorChain: {
        checkID: () => {
            return [
                v.isMongoObjectID(), notFoundCheck, s('id')
            ];
        },
        register: () => {            
            return [ 
                v.name(), v.username(), v.email(), v.password(), validationPassCheck,
                s('name'), s('username'), s('email'), s('password')
            ];
        },
        login: () => {
            return [ 
                v.username(), v.password(), validationPassCheck,
                s('username'), s('password')
            ];
        },
        googleLogin: () => {
            return [
                v.id_token(), validationPassCheck,
                s('id_token')
            ];
        },
        
        updateProfile: () => {
            return [
                vs.userUpdate,
                v.name(), v.email(), v.isModerator(), validationPassCheck,
                s('name'), s('email'), s('isModerator')
            ];
        },
        search: () => {
            return [
                vs.search, s('search')
            ];
        },
        addBook: () => {
            return [
                v.title(), v.author(), v.ISBN(), validationPassCheck,
                s('title'), s('author'), s('ISBN')
            ];
        },
        updateBook: () => {
            return [
                vs.bookUpdate,
                v.title(), v.author(), validationPassCheck,
                s('title'), s('author')
            ];
        },
        category: () => {
            return [
                v.category_name(), validationPassCheck, s('category_name')
            ];
        },
        getBooksInCategory: () => {
            return [
                v.category_name(), notFoundCheck, s('category_name')
            ];
        },
        getBookingsWithStatus: () => {
            return [
                v.status(), notFoundCheck, s('category_name')
            ];
        },
        addBooking: () => {
            return [
                v.quantity(), validationPassCheck, s('quantity')
            ];
        },
        updateBooking: () => {
            return [
                vs.bookingUpdate,
                v.quantity(), v.status(), validationPassCheck,
                s('quantity'), s('status')
            ];
        },
        addOrUpdateRating: () => {
            return [
                v.rating(), v.review(), validationPassCheck,
                s('rating'), s('review')
            ];
        }
    },
};

/**
 * Method to detect errors in mongo object ID
 * Calls error handler in case of error
 */
const notFoundCheck = (req, res, next) => {
    // if no error, move on
    if (validationResult(req).isEmpty()) {
        return next();
    }
    // there were errors
    const error = validationResult(req).array({onlyFirstError: true});

    return next(createError(404, error[0].msg));
};

/**
 * Method to detect errors in validation
 * Calls error handler in case of error
 */
const validationPassCheck = (req, res, next) => {
    // if no error, move on
    if (validationResult(req).isEmpty()) {
        return next();
    }
    // there were errors
    const error = validationResult(req).array({onlyFirstError: true});

    return next(createError(422, error[0].msg));
};

/**
 * Validator support for some of the paths
 * Helps with search and patch
 */
const vs = {
    // helps with search endpoints
    search: (req, res, next) => {
        // add search field if not already there
        if (!('search' in req.body)) {
            res.body.search = '';
        }
        
        return next();
    },

    // helps patch the user profile
    userUpdate: (req, res, next) => {
        // validated user id
        const targetUserId = req.params.id;

        // check if the user has previlige for this
        if (!req.user.isAdmin && req.user._id !== targetUserId) {
            return next(createError(403, 'user not authorized for this action'));
        }

        // username cannot be changed
        if ('username' in req.body) {
            return next(createError(403,'username cannot be changed'));
        }
        
        // only admin can give moderator previlige
        if ('isModerator' in req.body) {
            if (!req.user.isAdmin) {
                return next(createError(403, 'user not authorized for this action'));
            }
        }

        // password has to match the given constraint
        if ('password' in req.body) {
            const password = req.body.password;
            if (password.length < 4 || password.length > 20) {
                return next(createError(422, ''));
            } else {
                req.body.password = bcrypt.hashSync(password,12);
            }
        }

        User.findById(targetUserId)
            .then( (targetUser) => {
                // the target user does not exist
                if (!targetUser) {
                    return next(createError(404,'user not found'));
                }

                // user exists
                // bind name to body
                if (!('name' in req.body)) {
                    req.body.name = targetUser.name;
                }

                // bind email to body
                if (!('email' in req.body)) {
                    req.body.email = targetUser.email;
                }

                // bind email to body
                if (!('password' in req.body)) {
                    req.body.password = targetUser.password;
                }

                // bind name to body
                if (!('isModerator' in req.body)) {
                    req.body.isModerator = targetUser.isModerator;
                }

                next();
            })
            .catch( (err) => {
                return next(err);
            });
    },
    
    // helps patch the book profile
    bookUpdate: (req, res, next) => {
        // check if the user has previlige for this
        if (!req.user.isModerator) {
            return next(createError(403, 'user not authorized for this action'));
        }
        
        // ISBN cannot be changed
        if ('ISBN' in req.body) {
            return next(createError(403, 'ISBN cannot be changed'));
        }

        // validated book id
        const targetBookID = req.params.id;

        // look up the book in db
        Book.findById(targetBookID)
            .then( (targetBook) => {
                // the target book does not exist
                if (!targetBook) {
                    return next(createError(404,'book not found'));
                }

                // book exists
                // bind title to body
                if (!('title' in req.body)) {
                    req.body.title = targetBook.title;
                }

                // bind author to body
                if (!('author' in req.body)) {
                    req.body.author = targetBook.author;
                }

                next();
            })
            .catch( (err) => {
                return next(err);
            });
    },

    // helps patch the booking
    bookingUpdate: (req, res, next) => {
        // do not allow updates in user_id, book_id
        if ('user_id' in req.body || 'book_id' in req.body) {
            return next(createError(403, 'cannot change any attribute except quantity and status'));
        }

        // do not allow both status and quantity update
        if ('quantity' in req.body && 'status' in req.body) {
            return next(createError(403, 'cannot change status and quantity at once'));
        }

        // validated book id
        const targetBooking = req.params.id;
        
        // look up the booking for original data
        Booking.findById(targetBooking)
            .then( (booking) => {
                // booking does not exist
                if (!booking) {
                    return next(createError(404, 'booking does not exist'));
                }

                // already approved or cancelled booking cannot be updated
                if (booking.status === 'cancelled' || booking.status ==='approved') {
                    return next(createError(403, 'cannot update approved or cancelled booking'));
                }

                // check authorization of the user
                if (!req.user.isModerator && req.user._id !== booking.user_id) {
                    return next(createError(403, 'user does not have authorization for this action'));
                }

                // bind status to body
                if (!('status' in req.body)) {
                    req.body.status = booking.status;
                }
                
                // bind quantity to body
                if (!('quantity' in req.body)) {
                    // only moderator can approve
                    if (req.body.status === 'approved') {
                        if (!req.user.isModerator) {
                            return next(createError(403, 'user is not authorized for this action'));
                        }
                    }
                    req.body.quantity = booking.quantity;
                }

                next();
            })
            .catch( (err) => {
                return next(err);
            });
    }
};

/**
 * Simple sanitizer method
 * Trims and Escapes the input
 * @param {string} field // the field to sanitize
 */
const s = (field) => {
    return sanitize(field).trim();
};

/**
 * Different purpose validator chains
 * Bind errors with the 'req' object
 */
const v = {
    // validate the name
    name: () => {
        return check('name')
            .exists().withMessage('body must have a \'name\' field')
            .not().isEmpty().withMessage('\'name\' field must be non empty')
            .matches('^[A-Z a-z]+$').withMessage('\'name\' can contain only letters and spaces')
            .isLength({ min: 4, max: 30 }).withMessage('\'name\' has a length in range[4,30]');
    },
    // validate the username
    username: () => {
        return check('username')
            .exists().withMessage('body must have a \'username\' field')
            .not().isEmpty().withMessage('\'username\' field must be non empty')
            .isAlphanumeric().withMessage('\'username\' can contain only alphanumerics')
            .isLength({ min: 4, max: 20 }).withMessage('\'username\' has a length in range[4,20]');
    },
    // validate the email
    email: () => {
        return check('email')
            .exists().withMessage('body must have a \'email\' field')
            .not().isEmpty().withMessage('\'email\' field must be non empty')
            .isEmail().withMessage('\'email\' must be a valid email address');
    },
    // validate the password
    password: () => {
        return check('password')
            .exists().withMessage('body must have a \'password\' field')
            .not().isEmpty().withMessage('\'password\' field must be non empty')
            .isLength({ min: 4, max: 20 }).withMessage('\'password\' has a length in range[4,20]');
    },
    // validate isModerator attribute
    isModerator: () => {
        return check('isModerator')
            .exists().withMessage('body must have a \'isModerator\' field')
            .not().isEmpty().withMessage('\'isModerator\' field must be non empty')
            .isBoolean().withMessage('\'isModerator\' field must be a boolean');
    },
    // validate the book title
    title: () => {
        return check('title')
            .exists().withMessage('body must have a \'title\' field')
            .not().isEmpty().withMessage('\'title\' field must be non empty');
    },
    // validate the book author
    author: () => {
        return check('author')
            .exists().withMessage('body must have a \'author\' field')
            .not().isEmpty().withMessage('\'author\' field must be non empty');
    },
    // validate the ISBN
    ISBN: () => {
        return check('ISBN')
            .exists().withMessage('body must have a \'ISBN\' field')
            .not().isEmpty().withMessage('\'ISBN\' field must be non empty')
            .isISBN(10).withMessage('\'ISBN\' must have a ISBN 10 value');
    },
    // validate the category-name
    category_name: () => {
        return check('category_name')
            .exists().withMessage('req must have a \'category_name\' field')
            .not().isEmpty().withMessage('\'category_name\' field must be non empty');
    },
    // validate google id_token
    id_token: () => {
        return check('id_token')
            .exists().withMessage('body must have a \'id_token\' field')
            .not().isEmpty().withMessage('\'id_token\' field must be non empty');
    },
    // validate booking quantity
    quantity: () => {
        return check('quantity')
            .exists().withMessage('body must have a \'quantity\' field')
            .not().isEmpty().withMessage('\'quantity\' field must be non empty')
            .isInt({min: 1, max: 50}).withMessage('\'quantity\' must be between 1 and 50');
    },
    // validate the value of status
    status: () => {
        return check('status')
            .exists().withMessage('req must have a \'status\' field')
            .not().isEmpty().withMessage('\'status\' field must be non empty')
            .isIn(['pending', 'approved', 'cancelled']).withMessage('\'status\' must be valid');
    },
    // validate the rating
    rating: () => {
        return check('rating')
            .exists().withMessage('req must have a \'rating\' field')
            .not().isEmpty().withMessage('\'rating\' field must be non empty')
            .isInt({min: 1, max: 5});
    },
    // validate the review field
    review: () => {
        return check('review')
            .exists().withMessage('req must have a \'review\' field')
            .isLength({min: 0, max: 500});
    },
    // validate mongo objectID
    isMongoObjectID: () => {
        return check('id')
            .exists().withMessage('params must have a \'id\' field')
            .not().isEmpty().withMessage('\'id\' field must be non empty')
            .isMongoId().withMessage('\'id\' field must be a valid Mongo ObjectID');
    }
};

module.exports = AuthController;