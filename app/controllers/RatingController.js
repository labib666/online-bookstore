const createError = require('http-errors');

const Book = require('../models/Book');
const Rating = require('../models/Rating');

const RatingController = {    
    /**
     * GET /api/users/me/ratings
     * Returns ratings given by the current user
     * Expects: {
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: ratings }      // success
     *      401: {}                     // unauthorized for not logged in users
     *      500: {}                     // internal error
     * }
     */
    getRatingsByUser: (req, res, next) => {
        // find all the bookings by user
        Rating.find({
            user_id: req.user._id
        },{},{
            sort: {
                updatedAt: -1
            }
        })
            .then( (ratings) => {
                // respond with the bookings
                res.json({
                    message: 'succesfully retrieved user ratings',
                    ratings: ratings
                });
            })
            .catch( (err) => {
                return next(err);
            });
    },

    /**
     * GET /api/books/:id/ratings
     * Returns ratings given by all user for given book
     * Expects: {
     *      params: book._id
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: ratings }      // success
     *      401: {}                     // unauthorized for not logged in users
     *      404: {}                     // book not found
     *      500: {}                     // internal error
     * }
     */
    getAllRatingsForBook: (req, res, next) => {
        const targetBookID = req.params.id;

        // look for the book in db
        Book.findById(targetBookID)
            .then( (book) => {
                // book does not exist
                if (!book) {
                    return next(createError(404, 'book does not exist'));
                }
                // find all the ratings for the book
                Rating.find({
                    book_id: targetBookID
                },{},{
                    sort: {
                        updatedAt: -1
                    }
                })
                    .then( (ratings) => {
                        // respond with the ratings
                        res.json({
                            message: 'succesfully retrieved user ratings for book',
                            ratings: ratings
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
     * GET /api/books/:id/ratings/me
     * Returns ratings given by current user for given book
     * Expects: {
     *      params: book._id
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: rating }       // success
     *      401: {}                     // unauthorized for not logged in users
     *      404: {}                     // book/rating not found
     *      500: {}                     // internal error
     * }
     */
    getUserRatingsForBook: (req, res, next) => {
        const targetBookID = req.params.id;

        // look for the book in db
        Book.findById(targetBookID)    
            .then( (book) => {
                // book does not exist
                if (!book) {
                    return next(createError(404, 'book does not exist'));
                }
                // find the rating given by current user for this book
                Rating.findOne({ 
                    user_id: req.user._id,
                    book_id: targetBookID
                })
                    .then( (rating) => {
                        // rating does not exist
                        if (!rating) {
                            return next(createError(404, 'rating does not exist'));
                        }
                        // respond with the rating
                        res.json({
                            message: 'succesfully retrieved user ratings for book',
                            rating: rating
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
     * PUT /api/books/:id/ratings
     * Expects: {
     *      params: book._id
     *      body:   rating, review
     *      header: bearer-token
     * }
     * Creates a rating for the current user
     * Returns the new rating id
     * Responds: {
     *      200: { body: rating }       // success
     *      401: {}                     // unauthorized for not logged in users
     *      404: {}                     // book not found
     *      422: {}                     // invalid data
     *      500: {}                     // internal error
     * }
     */
    addOrUpdateRating: (req, res, next) => {
        const rating = req.body.rating;
        const review = req.body.review;

        // look for existing rating
        Rating.findOne({
            user_id: req.user._id,
            book_id: req.params.id
        })
            .then( (userRating) => {
                // rating does not exist
                if (!userRating) {
                    // create the rating
                    Rating.create({
                        user_id: req.user._id,
                        book_id: req.params.id,
                        rating: rating,
                        review: review
                    })
                        .then( (newRating) => {
                            // rating created. return the id
                            res.status(200).json({
                                message: 'successfully created/updated rating',
                                rating: newRating._id
                            });
                        })
                        .catch( (err) => {
                            return next(err);
                        });
                } else {
                    // rating exists. update it
                    userRating.rating = rating;
                    userRating.review = review;

                    // save the updated version
                    userRating.save()
                        .then( (savedRating) => {
                            // return the saved rating ID
                            res.status(200).json({
                                message: 'successfully created/updated rating',
                                rating: savedRating._id
                            });
                        })
                        .catch( (err) => {
                            return next(err);
                        });
                }
            })
            .catch( (err) => {
                return next(err);
            });
    },
    
};

module.exports = RatingController;