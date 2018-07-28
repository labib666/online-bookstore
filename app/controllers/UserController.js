const createError = require('http-errors');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const randomstring = require('randomstring');
const User = require('../models/User');
const Token = require('../models/Token');
const authenticator = require('../controllers/AuthController');

const validate = authenticator.validate;

const UserController = {
    /**
     * POST /api/register
     * Creates new user
     * Returns new user id
     * Expects: {
     *      body:   name, username, email, password
     * }
     * Responds: {
     *      200: { body: user } // success
     *      403: {}             // forbidden for logged in user
     *      422: {}             // invalid data provided
     *      409: {}             // conflict with existing data
     *      500: {}             // internal error
     * }
     */
    register: (req, res, next) => {
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

        User.findOne({ $or:[ { username: username }, { email: email } ] })
            .catch( (err) => {
                return next(err);
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
                        return next(err);
                    })
                    .then( (newUser) => {
                        // new user created
                        res.status(200).json({
                            message: 'registration successful',
                            user: newUser._id
                        });

                        return next();
                    });
            });
    },

    /**
     * POST /api/login
     * Logs in an existing user
     * Returns created token
     * Expects: {
     *      body:   username, password
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: token }    // success
     *      403: {}                 // forbidden for logged in user
     *      422: {}                 // invalid data provided
     *      404: {}                 // user not found
     *      401: {}                 // password mismatch
     *      500: {}                 // internal error
     * }
     */
    login: (req, res, next) => {
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
                return next(err);
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
                    expiresIn: '30m'
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
                        return next(err);
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

    /**
     * POST /api/logout
     * Logs out an existing user
     * Returns removed token
     * Expects: {
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: token }    // success
     *      401: {}                 // unauthorized for not logged in user
     *      500: {}                 // internal error
     * }
     */
    logout: (req, res, next) => {
        // logout the user
        Token.findByIdAndRemove(req.token)
            .catch( (err) => {
                return next(err);
            })
            .then( (token) => {
                res.status(200).json({
                    message: 'logout successful',
                    removedToken: token.token
                });

                return next();
            });
    },

    /**
     * GET /api/me
     * Returns user's own profile
     * Expects: {
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: user } // success
     *      401: {}             // unauthorized for not logged in user
     *      404: {}             // user not found
     *      500: {}             // internal error
     * }
     */
    getOwnProfile: (req, res, next) => {
        res.redirect('/api/user/'+req.user._id);
        
        return next();
    },

    /**
     * GET /api/users
     * Returns all user profiles
     * Expects: {
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: users }    // success
     *      401: {}                 // unauthorized for not logged in user
     *      500: {}                 // internal error
     * }
     */
    getAllProfiles: (req, res, next) => {
        // look up users in db
        User.find({}, {
            password: false,
            createdAt: false,
            updatedAt: false
        })
            .catch( (err) => {
                return next(err);
            })
            .then( (users) => {
                // add isAdmin field to the results
                users.forEach( (user) => {
                    user._doc.isAdmin = (user.email === process.env.SUPER_ADMIN);
                });

                // reply with the user profiles
                res.status(200).json({
                    message: 'successfully retrieved users',
                    users: users
                });
                
                return next();
            });
    },

    /**
     * GET /api/users/:id
     * Returns user profile for the given id
     * Expects: {
     *      params: user._id
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: user } // success
     *      401: {}             // unauthorized for not logged in user
     *      404: {}             // user not found
     *      500: {}             // internal error
     * }
     */
    getProfile: (req, res, next) => {
        // validate requested id
        validate.isMongoObejectID(req);
        const error = req.validationErrors();
        if (error) {
            const err = createError(404);
            err.message = error[0].msg;

            return next(err);
        }

        // look up user in db
        User.findById(req.params.id, {
            password: false,
            createdAt: false,
            updatedAt: false
        })
            .catch( (err) => {
                return next(err);
            })
            .then( (user) => {
                // user does not exist
                if (!user) {
                    const err = createError(404,'user not found');

                    return next(err);
                }
                // reply with the user profile
                user._doc.isAdmin = (user.email === process.env.SUPER_ADMIN);
                res.status(200).json({
                    message: 'successfully retrieved user data',
                    user: user
                });

                return next();
            });
    },

    /**
     * PATCH /api/users/:id
     * Updates user data
     * Returns user id
     * Expects: {
     *      params: user._id
     *      body:   name (optional), email (optional), password (optional), isModerator (optional)
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: user } // success
     *      401: {}             // unauthorized for not logged in user
     *      403: {}             // forbidden (changing username or admin previlizes)
     *      404: {}             // user not found
     *      422: {}             // invalid data provided
     *      500: {}             // internal error
     * }
     */
    updateProfile: (req,res,next) => {
        // validate requested id
        validate.isMongoObejectID(req);
        let error = req.validationErrors();
        if ( error ) {
            const err = createError(404);
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

        if ('email' in req.body) {
            User.findOne({ email: req.body.email })
                .catch( (err) => {
                    return next(err);
                })
                .then( (oldUser) => {
                    if (oldUser) {
                        const err = createError(409,'username or email already in use');

                        return next(err);
                    } else {
                        updateDatabaseWithProfile(targetUserId,req)
                            .then( (response) => {
                                res.json(response);
                                
                                return next();
                            })
                            .catch( (err) => {
                                return next(err);
                            });
                    }
                });
        } else {
            updateDatabaseWithProfile(targetUserId,req)
                .then( (response) => {
                    res.json(response);
                                
                    return next();
                })
                .catch( (err) => {
                    return next(err);
                });
        }
    },
    
};

/**
 * Method to aid updateProfile method in Usercontroller.
 * Once verification and validation is done, this method
 * is called to save the requested changes in database.
 * Returns a promise which resolves if changes are successfully
 * saved, and rejects if some error is encountered.
 * @param {string} targetUserId // the user to look up
 * @param {req}    req          // express request object
 */
const updateDatabaseWithProfile = (targetUserId, req) => {
    return new Promise( (resolve,reject) => {
        // everything is fine. look the user up and update
        User.findById(targetUserId)
            .catch( (err) => {
                return reject(err);
            })
            .then( (targetUser) => {
                // the target user does not exist
                if (!targetUser) {
                    const err = createError(404,'user not found');

                    return reject(err);
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
                if ('isModerator' in req.body) {
                    targetUser.isModerator = req.body.isModerator;
                }

                // save changed data in database
                targetUser.save()
                    .catch( (err) => {
                        return reject(err);
                    })
                    .then( (updatedUser) => {
                        const response = {
                            message: 'user successfully updated',
                            user: updatedUser._id
                        };

                        return resolve(response);
                    });
            });
    });
};

module.exports = UserController;
