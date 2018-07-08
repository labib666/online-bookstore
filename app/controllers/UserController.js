const createError = require('http-errors');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const randomstring = require('randomstring');
const User = require('../models/User');
const Token = require('../models/Token');

const validate = {
    // validate the name
    name: (req) => {
        req.checkBody('name')
            .exists().notEmpty()
            .trim().escape()
            .matches('^[A-Z a-z]+$')
            .isLength({ min: 4, max: 30 });
    },
    // validate the username
    username: (req) => {
        req.checkBody('username')
            .exists().notEmpty()
            .trim().escape()
            .isAlphanumeric()
            .isLength({ min: 4, max: 20 });
    },
    // validate the email
    email: (req) => {
        req.checkBody('email')
            .exists().notEmpty()
            .trim().escape()
            .isEmail();
    },
    // validate the password
    password: (req) => {
        req.checkBody('password')
            .exists().notEmpty()
            .trim().escape()
            .matches('^[^ \t\n\r]+$')
            .isLength({ min: 4, max: 20 });
    },
};

const UserController = {
    Register: (req, res, next) => {
        // user is already logged in?
        if (req.user) {
            const err = createError(400, 'user already logged in');

            return next(err);
        }

        // validate and sanitize the incoming data
        validate.name(req);
        validate.username(req);
        validate.email(req);
        validate.password(req);

        const error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(400);
            err.message = error;

            return next(err);
        } else { // Credentials are okay
            const name = req.body.name;
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const hashedPassword = bcrypt.hashSync(password,12);

            User.findOne({ $or:[ {username: username}, {email: email} ] }, (err, user) => {
                if (err) return next(err);
                // same username or email exists
                if (user) {
                    const err = createError(400,'Username or Email already in use');

                    return next(err);
                }
                // duplicate does not exist. create new user
                User.create({
                    name: name,
                    username: username,
                    email: email,
                    password: hashedPassword
                }, (err, newUser) => {
                    if (err) return next(err);
                    // new user created
                    console.log(newUser.username, 'created at', newUser.createdAt);
                    res.status(200).json({
                        message: 'registration successful',
                        username: username
                    });

                    return next();
                });
            });
        }
    },

    Login: (req, res, next) => {
        // user is already logged in?
        if (req.user) {
            const err = createError(400, 'user already logged in');

            return next(err);
        }

        // validate and sanitize the incoming data
        validate.username(req);
        validate.password(req);

        const error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(400);
            err.message = error;

            return next(err);
        } else { // credentials are okay
            const username = req.body.username;
            const password = req.body.password;
            // look for a user with this credential
            User.findOne({ username: username }, (err,user) => {
                if (err) return next(err);
                // user does not exist
                if (!user) {
                    const err = createError(400,'Invalid Username');

                    return next(err);
                }
                // user exists, check password
                // password does not match
                if (!bcrypt.compareSync(password,user.password)) {
                    const err = createError(400,'Password Mismatch');

                    return next(err);
                }
                // password matches
                // create an API token against this request
                const jwtSecret = process.env.JWT_SECRET;
                const jwtOptions = {
                    expiresIn: '30d'
                };
                let token;
                try {
                    const payload = {
                        _id: user._id,
                        ticket: randomstring.generate(50)
                    };
                    token = JWT.sign(payload, jwtSecret, jwtOptions);
                } catch (err) {
                    return next(err);
                }

                // save the token and respond to user
                Token.create({
                    token: token
                }, (err, newToken) => {
                    if (err) return next(err);
                    // new token created
                    console.log('new token created at', newToken.createdAt);
                    res.status(200).json({
                        message: 'login successful',
                        token: token
                    });

                    return next();
                });
            });
        }
    },

    Logout: (req, res, next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(400, 'user not logged in');

            return next(err);
        }

        // logout the user
        Token.findByIdAndRemove(req.token, (err, token) => {
            if (err) return next(err);
            res.status(200).json({
                message: 'logout successful',
                removedToken: token
            });

            return next();
        });
    },

    getProfile: (req, res, next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(400, 'user not logged in');

            return next(err);
        }

        // reply with the user profile
        User.findById(req.user, {
            password: false,
            createdAt: false,
            updatedAt: false
        }, (err,user) => {
            if (err) return next(err);
            res.json({
                message: 'successfully retrieved user data',
                user: user
            });

            return next();
        });
    }
};

module.exports = UserController;
