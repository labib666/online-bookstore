const createError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const valid = {
    // validate the username
    username: (username) => {
        return (!username) ? false : true;
    },
    // validate the email
    email: (email) => {
        return (!email) ? false : true;
    },
    // validate the password
    password: (password) => {
        return (!password) ? false : true;
    }
};

const UserController = {
    Register: (req, res, next) => {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        // validate credentials
        if ( !valid.username(username) || !valid.email(email) || !valid.password(password) ) {
            const err = createError(400,'Invalid Username, Email or Password');
            
            return next(err);
        }
        // credentials are okay
        else {
            const hashedPassword = bcrypt.hashSync(password,12);
            User.find({ $or:[ {'username': username}, {'email': email} ] }, (err, user) => {
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
                    console.log(newUser.username, 'created at', newUser.createdAt);
                    res.status(200).json({
                        message: 'new user created'
                    });
                    
                    return next();
                });
            });
        }
    },

    Login: (req, res, next) => {
        const username = req.body.username;
        const password = req.body.password;
        if ( !valid.username(username) || !valid.password(password) ) {
            const err = createError(400,'Invalid Username or Password');
            next(err);
        }
        else {
            next();
        }
    },

    Logout: (req, res, next) => {
        next();
    }
};

module.exports = UserController;
