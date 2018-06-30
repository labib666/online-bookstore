const UserController = {
    Login: (req, res, next) => {
        res.status(200);
        res.json({
            message: '12345678'
        });
        next();
    },

    Logout: (req, res, next) => {
        res.status(200);
        res.json({
            message: 'OK'
        });
        next();
    }
};

module.exports = UserController;
