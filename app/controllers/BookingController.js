const createError = require('http-errors');

const Book = require('../models/Book');
const BC = require('./BookController');
const Booking = require('../models/Booking');

const BookingController = {
    /**
     * GET /api/books/bookings/
     * Returns all bookings
     * Expects: {
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: bookings }     // success
     *      401: {}                     // unauthorized for not logged in users
     *      403: {}                     // forbidden for non moderator users
     *      500: {}                     // internal error
     * }
     */
    getAllBookings: (req, res, next) => {
        // only moderators have access
        if (!req.user.isModerator) {
            return next(createError(403, 'user not authorized for this action'));
        }

        // find all the bookings
        Booking.find({},{},{
            sort: {
                updatedAt: -1
            }
        })
            .then( (bookings) => {
                // respond with the bookings
                res.status(200).json({
                    message: 'succesfully retrieved bookings',
                    bookings: bookings
                });
            })
            .catch( (err) => {
                return next(err);
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
     *      404: {}                     // category not found
     *      500: {}                     // internal error
     * }
     */
    getBookingsWithStatus: (req, res, next) => {
        // only moderators have access
        if (!req.user.isModerator) {
            return next(createError(403, 'user not authorized for this action'));
        }

        // find all the bookings with this status
        Booking.find({
            status: req.params.status
        },{},{
            sort: {
                updatedAt: -1
            }
        })
            .then( (bookings) => {
                // respond with the bookings
                res.status(200).json({
                    message: 'succesfully retrieved bookings',
                    bookings: bookings
                });
            })
            .catch( (err) => {
                return next(err);
            });
    },

    /**
     * GET /api/users/me/bookings
     * Returns bookings done by the current user
     * Expects: {
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: bookings }     // success
     *      401: {}                     // unauthorized for not logged in users
     *      500: {}                     // internal error
     * }
     */
    getBookingsByUser: (req, res, next) => {
        // find all the bookings by user
        Booking.find({
            user_id: req.user._id
        },{},{
            sort: {
                updatedAt: -1
            }
        })
            .then( (bookings) => {
                // respond with the bookings
                res.status(200).json({
                    message: 'succesfully retrieved user bookings',
                    bookings: bookings
                });
            })
            .catch( (err) => {
                return next(err);
            });
    },

    /**
     * GET /api/books/:id/bookings
     * Returns bookings done by all user for given book
     * Expects: {
     *      params: book._id
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: bookings }     // success
     *      401: {}                     // unauthorized for not logged in users
     *      403: {}                     // forbidden for non moderators
     *      404: {}                     // book not found
     *      500: {}                     // internal error
     * }
     */
    getAllBookingsForBook: (req, res, next) => {
        // only moderators have access to this
        if (!req.user.isModerator) {
            return next(createError(403, 'user not authorized for this action'));
        }

        const targetBookID = req.params.id;

        // look for the book in db
        Book.findById(targetBookID)
            .then( (book) => {
                // book does not exist
                if (!book) {
                    return next(createError(404, 'book does not exist'));
                }
                // find all the bookings for the book
                Booking.find({
                    book_id: targetBookID
                },{},{
                    sort: {
                        updatedAt: -1
                    }
                })
                    .then( (bookings) => {
                        // respond with the bookings
                        res.status(200).json({
                            message: 'succesfully retrieved user bookings for book',
                            bookings: bookings
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
     * GET /api/books/:id/bookings/me
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
    getUserBookingsForBook: (req, res, next) => {
        const targetBookID = req.params.id;

        // look for the book in db
        Book.findById(targetBookID)    
            .then( (book) => {
                // book does not exist
                if (!book) {
                    return next(createError(404, 'book does not exist'));
                }
                // find all the bookings made by current user for this book
                Booking.find({ 
                    user_id: req.user._id,
                    book_id: targetBookID
                },{},{
                    sort: {
                        updatedAt: -1
                    }
                })
                    .then( (bookings) => {
                        // respond with the bookings
                        res.status(200).json({
                            message: 'succesfully retrieved user bookings for book',
                            bookings: bookings
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
     * POST /api/books/:id/bookings
     * Creates a booking for the current user
     * Returns the new booking id
     * Expects: {
     *      params: book._id
     *      body:   quantity
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: booking }      // success
     *      401: {}                     // unauthorized for not logged in users
     *      404: {}                     // book not found
     *      422: {}                     // invalid data
     *      500: {}                     // internal error
     * }
     */
    addBooking: (req, res, next) => {
        // create the booking
        Booking.create({
            user_id: req.user._id,
            book_id: req.params.id,
            quantity: req.body.quantity,
            status: 'pending'
        })
            .then( (booking) => {
            // booking completed. return the id
                res.status(200).json({
                    message: 'successfully completed booking',
                    booking: booking._id
                });
            })
            .catch( (err) => {
                return next(err);
            });    
    },

    /**
     * PATCH /api/books/bookings/:id
     * Updates a booking for the user
     * Returns the updated booking id
     * Expects: {
     *      params: booking._id
     *      body:   quantity (optional), status (optional)
     *      header: bearer-token
     * }
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
        // look up the booking in db
        const targetBookingID = req.params.id;

        Booking.findById(targetBookingID)
            
            .then( (booking) => {
                // booking exists
                booking.quantity = req.body.quantity;
                booking.status = req.body.status;

                // save the booking
                booking.save()
                    .then( (updatedBooking) => {
                        res.status(200).json({
                            message: 'successfully updated booking',
                            booking: updatedBooking._id
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
     * GET /api/books/report
     * Takes two dates. 
     * Returns the book sales in between the dates.
     * Expects: {
     *      query:  startDate, endDate
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: books }        // success
     *      401: {}                     // unauthorized for not logged in users
     *      403: {}                     // forbidden for non-admin
     *      422: {}                     // invalid data
     *      500: {}                     // internal error
     * }
     */
    salesReport: (req, res, next) => {
        // non admins cannot access
        if (req.user.isAdmin !== true) {
            return next(createError(403, 'user not authorized for this action'));
        }

        const start = req.query.startDate;
        const end = req.query.endDate;

        if (start > end) {
            return next(createError(422, 'start must be before end'));
        }

        // dates are okay. fetch record
        Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
                $group: {
                    _id: '$book_id',
                    count: { $sum: '$quantity' }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ])
            .then( (records) => {
                // fetch book profiles
                let entries = [], data = {};
                records.forEach( (record) => {
                    const id = record._id;
                    entries.push(id);
                    data[id] = record.count;
                });
                BC.getBookProfiles(entries)
                    .then( (responses) => {
                        // tag the booking quatity sum to books
                        let books = [];
                        responses.forEach( (book) => {
                            book.count = data[book._id];
                            books.push(book);
                        });
                        // respond with books
                        res.json({
                            message: 'successfully retrieved report',
                            books: books
                        });
                    })
                    .catch( (err) => {
                        return next(err);
                    });
            }).catch( (err) => {
                return next(err);
            });
    }
};

module.exports = BookingController;