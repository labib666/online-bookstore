const createError = require('http-errors');

const Book = require('../models/Book');
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
        Booking.find({},{},{
            sort: {
                updatedAt: -1
            }
        })
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
     *      422: {}                     // invalid data
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
            const err = createError(422);
            err.message = error[0].msg;

            return next(err);
        }

        // find all the bookings with this status
        Booking.find({
            status: req.params.status
        },{},{
            sort: {
                updatedAt: -1
            }
        })
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
     * Returns bookings done by the given user
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
        let error;

        // validate id field
        validate.isMongoObejectID(req);
        error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(404, 'user not found');

            return next(err);
        }

        // only moderators and the user have access
        if (!req.user.isModerator && req.user._id !== req.params.id) {
            const err = createError(403, 'user not authorized for this action');
            
            return next(err);
        }

        // look for the user in db
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
                // find all the bookings by user
                Booking.find({
                    user_id: user.id
                },{},{
                    sort: {
                        updatedAt: -1
                    }
                })
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

    /**
     * GET /api/books/:id/bookings
     * Returns bookings done by current user for given book
     * Expects: {
     *      params: book._id
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: bookings }     // success
     *      401: {}                     // unauthorized for not logged in users
     *      404: {}                     // book not found
     *      500: {}                     // internal error
     * }
     */
    getBookingsForBook: (req, res, next) => {
        let error;

        // validate id field
        validate.isMongoObejectID(req);
        error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(404, 'book not found');

            return next(err);
        }

        // look for the book in db
        Book.findById(req.params.id)
            .catch( (err) => {
                return next(err);
            })    
            .then( (book) => {
                // book does not exist
                if (!book) {
                    const err = createError(404, 'book does not exist');

                    return next(err);
                }
                // find all the pending bookings
                Booking.find({ 
                    user_id: req.user._id,
                    book_id: req.params.id
                },{},{
                    sort: {
                        updatedAt: -1
                    }
                })
                    .catch( (err) => {
                        return next(err);
                    })
                    .then( (bookings) => {
                        // respond with the bookings
                        res.json({
                            message: 'succesfully retrieved user bookings for book',
                            bookings: bookings
                        });
                    });
            });
    },

    /**
     * POST /api/books/:id/bookings
     * Expects: {
     *      params: book._id
     *      body:   quantity
     *      header: bearer-token
     * }
     * Creates a booking for the current user
     * Returns the new booking id
     * Responds: {
     *      200: { body: booking }      // success
     *      401: {}                     // unauthorized for not logged in users
     *      404: {}                     // book not found
     *      422: {}                     // invalid data
     *      500: {}                     // internal error
     * }
     */
    addBooking: (req, res, next) => {
        let error;
        
        // validate id field
        validate.isMongoObejectID(req);
        error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(404, 'book not found');

            return next(err);
        }

        // validate quantity field
        validate.quantity(req);
        error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(422);
            err.message = error[0].message;

            return next(err);
        }

        // create the booking
        Booking.create({
            user_id: req.user._id,
            book_id: req.params.id,
            quantity: req.body.quantity,
            status: 'pending'
        })
            .catch( (err) => {
                return next(err);
            })    
            .then( (booking) => {
                // booking completed. return the id
                res.status(200).json({
                    message: 'successfully completed booking',
                    booking: booking._id
                });
            });
    },

    /**
     * PATCH /api/books/bookings/:id
     * Expects: {
     *      params: booking._id
     *      body:   quantity (optional), status (optional)
     *      header: bearer-token
     * }
     * Updates a booking for the user
     * Returns the updated booking id
     * Responds: {
     *      200: { body: booking }      // success
     *      401: {}                     // unauthorized for not logged in users
     *      403: {}                     // forbidden actions attempted
     *      404: {}                     // book not found
     *      422: {}                     // invalid data
     *      500: {}                     // internal error
     * }
     */
    updateBooking: (req, res, next) => {
        // do not allow updates in user_id, book_id
        if ('user_id' in req.body || 'book_id' in req.body) {
            const err = createError(403, 'cannot change any attribute except quantity and status');

            return next(err);
        }

        // do not allow both status and quantity update
        if ('quantity' in req.body && 'status' in req.body) {
            const err = createError(403, 'cannot change status and quantity at once');

            return next(err);
        }

        let error;

        // validate id field
        validate.isMongoObejectID(req);
        error = req.validationErrors();
        
        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(404, 'booking not found');
            
            return next(err);
        }

        // validate status and quantity field
        if ('quantity' in req.body) {
            validate.quantity(req);
        }
        if ('status' in req.body) {
            validate.status(req);
        }

        error = req.validationErrors();

        // errors faced while validating / sanitizing
        if ( error ) {
            const err = createError(422);
            err.message = error[0].msg;

            return next(err);
        }

        // look up the booking in db
        Booking.findById(req.params.id)
            .catch( (err) => {
                return next(err);
            })
            .then( (booking) => {
                // booking does not exist
                if (!booking) {
                    const err = createError(404, 'booking does not exist');

                    return next(err);
                }

                // check authorization of the user
                if (!req.user.isModerator && req.user._id !== booking.user_id) {
                    const err = createError(403, 'user does not have authorization for this action');

                    return next(err);
                }

                // already approved or cancelled booking cannot be updated
                if (booking.status === 'cancelled' || booking.status ==='approved') {
                    const err = createError(403, 'cannot update approved or cancelled booking');

                    return next(err);
                } 

                // booking exists
                if ('quantity' in req.body) {
                    booking.quantity = req.body.quantity;
                }
                if ('status' in req.body) {
                    if (req.body.status === 'approved') {
                        // only moderator can approve
                        if (!req.user.isModerator) {
                            const err = createError(403, 'user is not authorized for this action');

                            return next(err);
                        }
                    }
                    booking.status = req.body.status;
                }

                // save the booking
                booking.save()
                    .catch( (err) => {
                        return next(err);
                    })
                    .then( (updatedBooking) => {
                        res.status(200).json({
                            message: 'successfully updated booking',
                            booking: updatedBooking._id
                        });
                    });
            });
    }
    
};

module.exports = BookingController;