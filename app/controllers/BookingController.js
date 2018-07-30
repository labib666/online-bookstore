const createError = require('http-errors');

const User = require('../models/User');
const Booking = require('../models/Booking');
const authenticator = require('../controllers/AuthController');

const validate = authenticator.validate;

const BookingController = {
    /**
     * GET /api/books/bookings/
     * Returns bookings with the given status
     * Expects: {
     *      params: status
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: bookings }     // success
     *      401: {}                     // unauthorized for not logged in users
     *      403: {}                     // forbidden for non moderator users
     *      500: {}                     // internal error
     * }
     */
    getAllBooking: (req, res, next) => {
        // only moderators have access
        if (!req.user.isModerator) {
            const err = createError(403, 'user not authorized for this action');
            
            return next(err);
        }

        // find all the bookings
        Booking.find()
            .catch( (err) => {
                return next(err);
            })
            .then( (bookings) => {
                // respond with the bookings
                res.json({
                    message: 'succesfully retrieved bookings',
                    bookings: bookings
                });
            });
    },
    
    /**
     * GET /api/books/bookings/:status
     * Returns bookings with the given status
     * Expects: {
     *      params: status
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: bookings }     // success
     *      401: {}                     // unauthorized for not logged in users
     *      403: {}                     // forbidden for non moderator users
     *      500: {}                     // internal error
     * }
     */
    getBookingsWithStatus: (req, res, next) => {
        // only moderators have access
        if (!req.user.isModerator) {
            const err = createError(403, 'user not authorized for this action');
            
            return next(err);
        }

        // validate status field
        validate.status(req);

        const error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(404);
            err.message = error[0].msg;

            return next(err);
        }

        // find all the bookings with this status
        Booking.find({ status: req.params.status} )
            .catch( (err) => {
                return next(err);
            })
            .then( (bookings) => {
                // respond with the bookings
                res.json({
                    message: 'succesfully retrieved bookings',
                    bookings: bookings
                });
            });
    },

    /**
     * GET /api/users/:id/bookings
     * Returns bookings with done by the given user
     * Expects: {
     *      params: user._id
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: bookings }     // success
     *      401: {}                     // unauthorized for not logged in users
     *      403: {}                     // forbidden for non moderator users != user
     *      404: {}                     // user not found
     *      500: {}                     // internal error
     * }
     */
    getBookingsByUser: (req, res, next) => {
        // validate status field
        validate.isMongoObejectID(req);

        const error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(404);
            err.message = error[0].msg;

            return next(err);
        }

        // only moderators and the user have access
        if (!req.user.isModerator && req.user._id !== req.params.id) {
            const err = createError(403, 'user not authorized for this action');
            
            return next(err);
        }

        User.findById(req.params.id)
            .catch( (err) => {
                return next(err);
            })    
            .then( (user) => {
                // user does not exist
                if (!user) {
                    const err = createError(404, 'user does not exist');

                    return next(err);
                }
                // find all the pending bookings
                Booking.find({ user_id: user.id} )
                    .catch( (err) => {
                        return next(err);
                    })
                    .then( (bookings) => {
                        // respond with the bookings
                        res.json({
                            message: 'succesfully retrieved user bookings',
                            bookings: bookings
                        });
                    });
            });
    },

};

module.exports = BookingController;