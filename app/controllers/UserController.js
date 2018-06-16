const UserController = {
    Login: (req, res, next) => {
        res.status(200);
        res.send('12345678');
        next();
    },

    Logout: (req, res, next) => {
        res.status(200);
        res.send('OK');
        next();
    }
};

module.exports = UserController;
