const createError = require('http-errors');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const htmlspecialchars = require('htmlspecialchars');
const User = require('../models/User');
const Token = require('../models/Token');

const jwtOptions = {
    expiresIn: '10m'
};

const valid = {
    // validate the username
    username: (username) => {
        const regex = new RegExp('^[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]$');
        //console.log(username, regex.test(username));
        
        return (regex.test(username) && username.length >= 4 && username.length <= 20);
    },
    // validate the email
    email: (email) => {
        const regex = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$');
        //console.log(email, regex.test(email));
        
        return regex.test(email);
    },
    // validate the username
    name: (name) => {
        const regex = new RegExp('^[a-zA-Z]+([ ][a-zA-Z]+)*([ ][a-zA-Z]+)$');
        //console.log(name, regex.test(name));
        
        return (regex.test(name) && name.length >= 4 && name.length <= 20);
    },
    // validate the password
    password: (password) => {
        const regex = new RegExp('^[^\n\r ]{4,20}$');
        //console.log(password, regex.test(password));
        
        return regex.test(password);
    }
};

const UserController = {
    Register: (req, res, next) => {
        // user is already logged in? 
        if (req.user) {
            const err = createError(400, 'user already logged in');
            
            return next(err);
        }

        const username = htmlspecialchars(req.body.username);
        const email = req.body.email;
        const name = htmlspecialchars(req.body.name);
        const password = req.body.password;

        // validate credentials
        if ( !valid.username(username) || !valid.email(email) || !valid.name(name) || !valid.password(password) ) {
            const err = createError(400,'Invalid Username, Email or Password');
            
            return next(err);
        }
        // credentials are okay
        else {
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
        const username = req.body.username;
        const password = req.body.password;

        // validate credentials
        if ( !valid.username(username) || !valid.password(password) ) {
            const err = createError(400,'Invalid Username or Password');
            
            return next(err);
        }
        // credentials are okay
        else {
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
                let token;
                try {
                    const payload = {
                        _id: user._id,
                        createdAt: new Date()
                    };
                    token = JWT.sign(payload, process.env.JWT_SECRET, jwtOptions);
                }
                catch (err) {
                    return next(err);
                }

                // duplicate request?
                Token.findOne({ token: token }, (err,exToken) => {
                    if (err) return next(err);
                    if (exToken) {
                        const err = createError(400,'Duplicate request');
                    
                        return next(err);
                    }
                    // save the token and respond to user
                    Token.create({
                        token: token
                    }, (err, newToken) => {
                        if (err) return next(err);
                        // new token created
                        console.log(newToken.token, 'created at', newToken.createdAt);
                        res.status(200).json({
                            message: 'login successful',
                            token: token
                        });
                        
                        return next();
                    });
                });
            });
        }
    },

    Logout: (req, res, next) => {
        // user is already logged in? 
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
    }
};

module.exports = UserController;
