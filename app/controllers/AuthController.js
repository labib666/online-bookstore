const JWT = require('jsonwebtoken');
const Token = require('../models/Token');

const AuthController = {
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
            ignoreExpiration: true
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
                if (err) return next(err);
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
        // validate isAdmin attribute
        isModerator: (req) => {
            req.checkBody('isModerator')
                .exists().withMessage('body must have a \'isModerator\' field')
                .notEmpty().withMessage('\'isModerator\' field must be non empty')
                .isBoolean().withMessage('\'isModerator\' field must be a boolean');
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
