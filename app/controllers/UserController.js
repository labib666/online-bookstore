const UserController = {
    Register: (req, res, next) => {
        next();
    },

    Login: (req, res, next) => {
        res.status(200);
        res.json({
            message: 'Logged In',
            token: 'Token'
        });
        next();
    },

    Logout: (req, res, next) => {
        res.status(200);
        res.json({
            message: 'Logged Out'
        });
        next();
    }
};

module.exports = UserController;
