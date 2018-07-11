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
};

const UserController = {
    register: (req, res, next) => {
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
        } 
        
        // Credentials are okay
        const name = req.body.name;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const hashedPassword = bcrypt.hashSync(password,12);

        User.findOne({ $or:[ {username: username}, {email: email} ] })
            .catch( (err) => {
                if (err) return next(err);
            })
            .then( (user) => {
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
                    password: hashedPassword,
                    isModerator: (email === process.env.SUPER_ADMIN)
                })
                    .catch( (err) => {
                        if (err) return next(err);
                    })
                    .then( (newUser) => {
                        // new user created
                        console.log(newUser.username, 'created at', newUser.createdAt);
                        res.status(200).json({
                            message: 'registration successful',
                            username: username
                        });

                        return next();
                    });
            });
    },

    login: (req, res, next) => {
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
        }

        const username = req.body.username;
        const password = req.body.password;

        // look for a user with this credential
        User.findOne({ username: username })
            .catch( (err) => {
                if (err) return next(err);
            })
            .then( (user) => {
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
                let token, isAdmin, isModerator;
                isAdmin = (user.email === process.env.SUPER_ADMIN) ? true : false;
                isModerator = (isAdmin || user.isModerator) ? true : false;
                try {
                    const payload = {
                        _id: user._id,
                        isAdmin: isAdmin,
                        isModerator: isModerator,
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
    },

    logout: (req, res, next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(400, 'user not logged in');

            return next(err);
        }

        // logout the user
        Token.findByIdAndRemove(req.token)
            .catch( (err) => {
                if (err) return next(err);
            })
            .then( (token) => {
                res.status(200).json({
                    message: 'logout successful',
                    removedToken: token
                });

                return next();
            });
    },

    getOwnProfile: (req, res, next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(400, 'user not logged in');

            return next(err);
        }

        res.redirect('/api/user/'+req.user._id);
        
        return next();
    },

    getProfile: (req, res, next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(400, 'user not logged in');

            return next(err);
        }

        // validate requested id
        validate.isMongoObejectID(req);
        const error = req.validationErrors();
        if (error) {
            const err = createError(400);
            err.message = error;

            return next(err);
        }

        // reply with the user profile
        User.findById(req.params.id, {
            password: false,
            createdAt: false,
            updatedAt: false
        })
            .catch( (err) => {
                if (err) return next(err);
            })
            .then( (user) => {
                user._doc.isAdmin = (user.email === process.env.SUPER_ADMIN);
                res.status(200).json({
                    message: 'successfully retrieved user data',
                    user: user
                });
            });
    },

    updateProfile: (req,res,next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(400, 'user not logged in');

            return next(err);
        }

        // is the given ID valid?
        validate.isMongoObejectID(req);
        let error = req.validationErrors();
        if ( error ) {
            const err = createError(400);
            err.message = error;

            return next(err);
        }

        // validated user id
        const targetUserId = req.params.id;

        // check if the user has previlige for this
        if (!req.user.isAdmin && req.user._id !== targetUserId) {
            const err = createError(401, 'user not authorized for this action');

            return next(err);
        }

        // username cannot be changed
        if (req.body.username) {
            const err = createError(400,'username cannot be changed');

            return next(err);
        }
        
        // only admin can give moderator previlige
        if (req.body.isModerator) {
            if (!req.user.isAdmin) {
                const err = createError(401, 'user not authorized for this action');

                return next(err);
            }
            validate.isModerator(req);
        }

        // validate and sanitize the incoming data
        if (req.body.name) validate.name(req);
        if (req.body.email) validate.email(req);
        if (req.body.password)validate.password(req);

        error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(400);
            err.message = error;

            return next(err);
        }

        // everything is fine. look the user up and update
        User.findById(targetUserId)
            .catch( (err) => {
                if (err) return next(err);
            })
            .then( (targetUser) => {
                // the target user does not exist
                if (!targetUser) {
                    const err = createError(400,'Invalid User ID');

                    return next(err);
                }

                // user exists, make necessary changes
                if (req.body.name) {
                    targetUser.name = req.body.name;
                }
                if (req.body.email) {
                    targetUser.email = req.body.email;
                }
                if (req.body.password) {
                    targetUser.password = bcrypt.hashSync(req.body.password,12);
                }
                
                // don't change access for the admin
                if (req.body.isModerator) { 
                    targetUser.isModerator = (req.user.isAdmin && 
                        req.user._id == targetUserId) ? true : req.body.isModerator;
                }

                targetUser.save()
                    .catch( (err) => {
                        if (err) return next(err);
                    })
                    .then( (updatedUser) => {
                        res.status(200).json({
                            message: 'user successfully updated',
                            username: updatedUser.username
                        });
                    });
            });
    },

    getAllProfiles: (req, res, next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(400, 'user not logged in');

            return next(err);
        }

        // reply with the user profile
        User.find({}, {
            password: false,
            createdAt: false,
            updatedAt: false
        })
            .catch( (err) => {
                if (err) return next(err);
            })
            .then( (users) => {
                res.status(200).json({
                    message: 'successfully retrieved users',
                    users: users
                });
                
                return next();
            });
    },

    getModeratorProfiles: (req, res, next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(400, 'user not logged in');

            return next(err);
        }

        // reply with the user profile
        User.find({isModerator: true}, {
            password: false,
            createdAt: false,
            updatedAt: false
        })
            .catch( (err) => {
                if (err) return next(err);
            })
            .then( (users) => {
                res.status(200).json({
                    message: 'successfully retrieved moderators',
                    users: users
                });
                
                return next();
            });
    }
};

module.exports = UserController;
