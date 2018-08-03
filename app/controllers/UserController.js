const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const randomstring = require('randomstring');
const gAuth = require('google-auth-library');

const User = require('../models/User');
const Token = require('../models/Token');

const client = new gAuth.OAuth2Client(
    process.env.GOOGLE_DEV_CLIENT_ID
);

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
     *      409: {}             // conflict with existing data
     *      422: {}             // invalid data provided
     *      500: {}             // internal error
     * }
     */
    register: (req, res, next) => {        
        // credentials are okay
        const name = req.body.name;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const hashedPassword = bcrypt.hashSync(password,12);

        User.findOne({ $or:[ { username: username }, { email: email } ] })
            .then( (user) => {
                // same username or email exists
                if (user) {
                    return next(createError(409,'username or email already in use'));
                }

                // duplicate does not exist. create new user
                User.create({
                    name: name,
                    username: username,
                    email: email,
                    password: hashedPassword,
                    isModerator: (email === process.env.SUPER_ADMIN)
                })
                    .then( (newUser) => {
                        // new user created
                        res.status(200).json({
                            message: 'registration successful',
                            user: newUser._id
                        });
                    })
                    .catch( (err) => {
                        return next(err);
                    });
            })
            .catch( (err) => {
                return next(err);
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
     *      401: {}                 // password mismatch
     *      403: {}                 // forbidden for logged in user
     *      404: {}                 // user not found
     *      422: {}                 // invalid data provided
     *      500: {}                 // internal error
     * }
     */
    login: (req, res, next) => {
        // credentials are okay
        const username = req.body.username;
        const password = req.body.password;

        // look for a user with this credential
        User.findOne({ username: username })
            .then( (user) => {
                // user does not exist
                if (!user) {
                    return next(createError(404,'user not found'));
                }
                // user exists, check password
                // password does not match
                if (!bcrypt.compareSync(password,user.password)) {
                    return next(createError(401,'password mismatch'));
                }
                // password matches
                // create an api token
                createLoginToken(user)
                    .then( (token) => {
                        res.status(200).json(token);
                    })
                    .catch( (err) => {
                        return next(err);
                    });
            })
            .catch( (err) => {
                return next(err);
            });
    },

    /**
     * POST /api/social/google
     * Logs in an existing user
     * Returns created token
     * Expects: {
     *      body:   username, password
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: token }    // success
     *      403: {}                 // forbidden for logged in user
     *      404: {}                 // user not found
     *      422: {}                 // invalid data provided
     *      500: {}                 // internal error
     */
    googleLogin: (req,res,next) => {
        // id_token is usable
        const id_token = req.body.id_token;

        client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_DEV_CLIENT_ID
        })
            .then( (ticket) => {
                const payload = ticket.getPayload();

                // found user email. check if this email exists in db
                User.findOne({ email: payload.email })
                    .then( (user) => {
                        // user does not exist
                        if (!user) {
                            return next(createError(404,'user not found'));
                        }
                        // user exists
                        // create an api token
                        createLoginToken(user)
                            .then( (token) => {
                                res.status(200).json(token);
                            })
                            .catch( (err) => {
                                return next(err);
                            });
                    })
                    .catch( (err) => {
                        return next(err);
                    });
            })
            .catch( (err) => {
                return next(err);
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
            .then( (token) => {
                res.status(200).json({
                    message: 'logout successful',
                    removedToken: token.token
                });
            })
            .catch( (err) => {
                return next(err);
            });
    },

    /**
     * GET /api/users/me
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
    getOwnProfile: (req, res) => {
        res.redirect('/api/users/'+req.user._id);
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
            .then( (entries) => {
                let users = [];
                // add isAdmin field to the results
                entries.forEach( (user) => {
                    user = user.toObject();
                    user.isAdmin = (user.email === process.env.SUPER_ADMIN);
                    users.push(user);
                });

                // reply with the user profiles
                res.status(200).json({
                    message: 'successfully retrieved users',
                    users: users
                });
            })
            .catch( (err) => {
                return next(err);
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
        // id is okay
        const targetUserId = req.params.id;

        // look up user in db
        User.findById(targetUserId, {
            password: false,
            createdAt: false,
            updatedAt: false
        })
            .then( (user) => {
                // user does not exist
                if (!user) {
                    return next(createError(404,'user not found'));
                }
                // reply with the user profile
                user = user.toObject();
                user.isAdmin = (user.email === process.env.SUPER_ADMIN);
                res.status(200).json({
                    message: 'successfully retrieved user data',
                    user: user
                });
            })
            .catch( (err) => {
                return next(err);
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
     *      403: {}             // forbidden (changing username)
     *      404: {}             // user not found
     *      422: {}             // invalid data provided
     *      500: {}             // internal error
     * }
     */
    updateProfile: (req,res,next) => {
        // validated user id
        const targetUserId = req.params.id;

        // check if email in use
        User.findOne({ email: req.body.email })
            .then( (oldUser) => {
                if (oldUser && oldUser._id.toString() !== targetUserId) {
                    return next(createError(409,'email already in use'));
                } else {
                    updateDatabaseWithProfile(targetUserId,req)
                        .then( (response) => {
                            res.status(200).json(response);
                        })
                        .catch( (err) => {
                            return next(err);
                        });
                }
            })
            .catch( (err) => {
                return next(err);
            });
    },

    /**
     * POST /api/users/search
     * Fetches all the users that match the search
     * Expects: {
     *      body:   search
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: users }    // success
     *      401: {}                 // unauthorized for not logged in users
     *      500: {}                 // internal error
     * }
     */
    searchUser: (req,res,next) => {
        const search = req.body.search;

        if (search.length === 0) {
            // search field does not exist or is empty
            res.status(200).json({
                message: 'search results',
                users: []
            });
        } else {
            // look for the searched string
            User.find({
                $text: {
                    $search: search
                }
            },{
                password: false,
                createdAt: false,
                updatedAt: false,
                score: {
                    $meta: 'textScore'
                }
            }, {
                sort: {
                    score: {
                        $meta: 'textScore'
                    }
                }
            })
                .then( (entries) => {
                    const users = [];
                    // add isAdmin field to the results
                    entries.forEach( (user) => {
                        user = user.toObject();
                        user.isAdmin = (user.email === process.env.SUPER_ADMIN);
                        users.push(user);
                    });

                    // reply with the user profiles
                    res.status(200).json({
                        message: 'successfully retrieved users',
                        users: users
                    });
                })
                .catch( (err) => {
                    return next(err);
                });
        }
    }
    
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
            .then( (targetUser) => {
                // user exists, make necessary changes
                targetUser.name = req.body.name;
                targetUser.email = req.body.email;
                targetUser.password = req.body.password;
                targetUser.isModerator = req.body.isModerator;

                // save changed data in database
                targetUser.save()
                    .then( (updatedUser) => {
                        const response = {
                            message: 'user successfully updated',
                            user: updatedUser._id
                        };

                        resolve(response);
                    })
                    .catch( (err) => {
                        reject(err);
                    });
            })
            .catch( (err) => {
                reject(err);
            });
    });
};

/**
 * Create an API token for the given user
 * @param {User} user   // the user who is logging in
 */
const createLoginToken = (user) => {
    return new Promise( (resolve, reject) => {
        const jwtSecret = process.env.JWT_SECRET;
        const jwtOptions = {
            expiresIn: '12h'
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
            reject(err);
        }

        // save the token and respond to user
        Token.create({ token: token })
            .then( (newToken) => {
                // new token created
                resolve({
                    message: 'login successful',
                    token: newToken.token
                });
            })
            .catch( (err) => {
                reject(err);
            });
    });
};

module.exports = UserController;
