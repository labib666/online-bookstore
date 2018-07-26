const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const Token = require('../models/Token');

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
            .catch( (err) => {
                return next(err);
            })
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
            const err = createError(401, 'user not logged in');

            return next(err);
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
            const err = createError(403, 'user already logged in');

            return next(err);
        } else {
            return next();
        }
    },

    /**
     * Different purpose validators
     * Bind errors with the 'req' object
     */
    validate: {
        // validate the name
        name: (req) => {
            req.checkBody('name')
                .exists().withMessage('body must have a \'name\' field')
                .notEmpty().withMessage('\'name\' field must be non empty')
                .trim().escape()
                .matches('^[A-Z a-z]+$').withMessage('\'name\' can contain only letters and spaces')
                .isLength({ min: 4, max: 30 }).withMessage('\'name\' has a length in range[4,30]');
        },
        // validate the username
        username: (req) => {
            req.checkBody('username')
                .exists().withMessage('body must have a \'username\' field')
                .notEmpty().withMessage('\'username\' field must be non empty')
                .trim().escape()
                .isAlphanumeric().withMessage('\'username\' can contain only alphanumerics')
                .isLength({ min: 4, max: 20 }).withMessage('\'username\' has a length in range[4,20]');
        },
        // validate the email
        email: (req) => {
            req.checkBody('email')
                .exists().withMessage('body must have a \'email\' field')
                .notEmpty().withMessage('\'email\' field must be non empty')
                .trim().escape()
                .isEmail().withMessage('\'email\' must be a valid email address');
        },
        // validate the password
        password: (req) => {
            req.checkBody('password')
                .exists().withMessage('body must have a \'password\' field')
                .notEmpty().withMessage('\'password\' field must be non empty')
                .trim().escape()
                .matches('^[^ \t\n\r]+$').withMessage('\'password\' field cannot contain space or newlines')
                .isLength({ min: 4, max: 20 }).withMessage('\'password\' has a length in range[4,20]');
        },
        // validate isModerator attribute
        isModerator: (req) => {
            req.checkBody('isModerator')
                .exists().withMessage('body must have a \'isModerator\' field')
                .notEmpty().withMessage('\'isModerator\' field must be non empty')
                .isBoolean().withMessage('\'isModerator\' field must be a boolean');
        },
        // validate the book title
        title: (req) => {
            req.checkBody('title')
                .exists().withMessage('body must have a \'title\' field')
                .notEmpty().withMessage('\'title\' field must be non empty')
                .trim().escape();
        },
        // validate the book author
        author: (req) => {
            req.checkBody('author')
                .exists().withMessage('body must have a \'author\' field')
                .notEmpty().withMessage('\'author\' field must be non empty')
                .trim().escape();
        },
        // validate the ISBN
        ISBN: (req) => {
            req.checkBody('ISBN')
                .exists().withMessage('body must have a \'ISBN\' field')
                .notEmpty().withMessage('\'ISBN\' field must be non empty')
                .trim().escape()
                .isISBN(10).withMessage('\'ISBN\' must have a ISBN 10 value');
        },
        // validate mongo objectID
        isMongoObejectID: (req) => {
            req.checkParams('id')
                .exists().withMessage('params must have a \'id\' field')
                .notEmpty().withMessage('\'id\' field must be non empty')
                .trim().escape()
                .isMongoId().withMessage('\'id\' field must be a valid Mongo ObjectID');
        }
    }
};

module.exports = AuthController;
