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
            return next(err);
        }

        // see if the token exists in database
        Token.findOne({ token: req.token })
            .catch( (err) => {
                if (err) {
                    err.status = 500;
    
                    return next(err);
                }
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
    
    failedJWT: (err, req, res, next) => {
        if (err.status === 500) return next(err);
        err.status = 400;
        err.message = 'invalid JWT';

        return next(err);
    }
};

module.exports = AuthController;
