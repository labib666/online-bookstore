const JWT = require('jsonwebtoken');
const Token = require('../models/Token');

const AuthController = {
    getUserData: (req, res, next) => {
        // user did not send a token
        if (!req.token) {
            req.user = null;

            return next();
        } else { // verify the payload
            const jwtSecret = process.env.JWT_SECRET;
            const jwtOptions = {
                ignoreExpiration: true
            };
            // works asynchronously when there is a callback
            // payload contains decoded token
            JWT.verify(req.token, jwtSecret, jwtOptions, (err, payload) => {
                if (err) return next(err);
                // see if the token exists in database
                Token.findOne({ token: req.token }, (err, token) => {
                    if (err) {
                        err.status = 500;

                        return next(err);
                    }
                    // no such token exists
                    if (!token) {
                        req.user = null;

                        return next();
                    }
                    // if all is ok, attach the user id to req
                    req.user = payload._id;

                    // change the token to its id in token table
                    req.token = token._id;

                    return next();
                });
            });
        }
    },
    failedJWT: (err, req, res, next) => {
        if (err.status === 500) return next(err);
        err.status = 400;
        err.message = 'invalid JWT';

        return next(err);
    }
};

module.exports = AuthController;
