const createError = require('http-errors');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const randomstring = require('randomstring');
const User = require('../models/User');
const Token = require('../models/Token');
const authenticator = require('../controllers/AuthController');

const validate = authenticator.validate;

const UserController = {
    register: (req, res, next) => {
        // user is already logged in?
        if (req.user) {
            const err = createError(403, 'user already logged in');

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
            const err = createError(422);
            err.message = error[0].msg;     // return the first error

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
                    const err = createError(409,'username or email already in use');

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
                        // erase the password before sending the response
                        delete newUser._doc.password;
                        res.status(200).json({
                            message: 'registration successful',
                            user: newUser
                        });

                        return next();
                    });
            });
    },

    login: (req, res, next) => {
        // user is already logged in?
        if (req.user) {
            const err = createError(403, 'user already logged in');

            return next(err);
        }

        // validate and sanitize the incoming data
        validate.username(req);
        validate.password(req);

        const error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(422);
            err.message = error[0].msg;     // return the first error

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
                    const err = createError(404,'user not found');

                    return next(err);
                }
                // user exists, check password
                // password does not match
                if (!bcrypt.compareSync(password,user.password)) {
                    const err = createError(401,'password mismatch');

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
                Token.create({ token: token })
                    .catch( (err) => {
                        if (err) return next(err);
                    })
                    .then( (newToken) => {
                        // new token created
                        res.status(200).json({
                            message: 'login successful',
                            token: newToken.token
                        });
                    });
            });
    },

    logout: (req, res, next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(401, 'user not logged in');

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
            const err = createError(401, 'user not logged in');

            return next(err);
        }

        res.redirect('/api/user/'+req.user._id);
        
        return next();
    },

    getProfile: (req, res, next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(401, 'user not logged in');

            return next(err);
        }

        // validate requested id
        validate.isMongoObejectID(req);
        const error = req.validationErrors();
        if (error) {
            const err = createError(400);
            err.message = error[0].msg;

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
                // user does not exist
                if (!user) {
                    const err = createError(404,'user not found');

                    return next(err);
                }
                user._doc.isAdmin = (user.email === process.env.SUPER_ADMIN);
                res.status(200).json({
                    message: 'successfully retrieved user data',
                    user: user
                });

                return next();
            });
    },

    updateProfile: (req,res,next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(401, 'user not logged in');

            return next(err);
        }

        // is the given ID valid?
        validate.isMongoObejectID(req);
        let error = req.validationErrors();
        if ( error ) {
            const err = createError(400);
            err.message = error[0].msg;

            return next(err);
        }

        // validated user id
        const targetUserId = req.params.id;

        // check if the user has previlige for this
        if (!req.user.isAdmin && req.user._id !== targetUserId) {
            const err = createError(403, 'user not authorized for this action');

            return next(err);
        }

        // username cannot be changed
        if ('username' in req.body) {
            const err = createError(403,'username cannot be changed');

            return next(err);
        }
        
        // only admin can give moderator previlige
        if ('isModerator' in req.body) {
            if (!req.user.isAdmin) {
                const err = createError(403, 'user not authorized for this action');

                return next(err);
            }
            validate.isModerator(req);
        }

        // validate and sanitize the incoming data
        if ('name' in req.body) validate.name(req);
        if ('email' in req.body) validate.email(req);
        if ('password' in req.body)validate.password(req);

        error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(422);
            err.message = error[0].msg;     // return the first error

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
                    const err = createError(404,'user not found');

                    return next(err);
                }

                // user exists, make necessary changes
                if ('name' in req.body) {
                    targetUser.name = req.body.name;
                }
                if ('email' in req.body) {
                    targetUser.email = req.body.email;
                }
                if ('password' in req.body) {
                    targetUser.password = bcrypt.hashSync(req.body.password,12);
                }
                
                // don't change access for the admin
                if ('isModerator' in req.body) {
                    const changingAdminPrev = (req.user.isAdmin && req.user._id === targetUserId);
                    targetUser.isModerator = (changingAdminPrev) ? true : req.body.isModerator;
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

                        return next();
                    });
            });
    },

    getAllProfiles: (req, res, next) => {
        // user is not logged in?
        if (!req.user) {
            const err = createError(401, 'user not logged in');

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
                // add isAdmin field to the results
                users.forEach( (user) => {
                    user._doc.isAdmin = (user.email === process.env.SUPER_ADMIN);
                });

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
            const err = createError(401, 'user not logged in');

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
                // add isAdmin field to the results
                users.forEach( (user) => {
                    user._doc.isAdmin = (user.email === process.env.SUPER_ADMIN);
                });

                res.status(200).json({
                    message: 'successfully retrieved moderators',
                    users: users
                });
                
                return next();
            });
    }
};

module.exports = UserController;
