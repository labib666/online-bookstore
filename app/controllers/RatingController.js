const createError = require('http-errors');
const raccoon = require('raccoon');

const Book = require('../models/Book');
const Rating = require('../models/Rating');
const BC = require('./BookController');

/**
 * Finds the average rating of a book.
 * Returns null if no one rated the book.
 * Returns the average rating, when ratings are found.
 * @param {Mongo Object ID} targetBookID // book to look for
 */
const getAverageRating = (targetBookID) => {
    // look for the book in db
    return new Promise( (resolve,reject) => {    
        Book.findById (targetBookID)
            .then( (book) => {
                // book does not exist
                if (!book) {
                    return reject (createError(404, 'book does not exist'));
                }
                // find the average rating for the book
                Rating.aggregate([
                    {
                        $match: {
                            book_id: targetBookID
                        }
                    },
                    {
                        $group: {
                            _id: '$book_id',
                            rating: { $avg: '$rating' },
                            count: { $sum: 1 }
                        }
                    }
                ])
                    .then( (records) => {
                        if (records.length === 0) {
                            resolve (null);
                        } else {
                            resolve ({
                                rating: records[0].rating,
                                count: records[0].count
                            });
                        }
                    }).catch( (err) => {
                        return reject(err);
                    });
            })
            .catch( (err) => {
                return reject(err);
            });
    });
};

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
                res.status(200).json({
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
                        res.status(200).json({
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
                        res.status(200).json({
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
    
    getAverageRating: getAverageRating,

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
                            
                            return newRating;
                        })
                        .then( (newRating) => {
                            // update raccoon preference
                            if (newRating.rating >= 3) {
                                raccoon.liked(newRating.user_id, newRating.book_id);
                            } else {
                                raccoon.disliked(newRating.user_id, newRating.book_id);
                            }
                        })
                        .catch( (err) => {
                            return next(err);
                        });
                } else {
                    // undo previous raccoon preference
                    if (userRating.rating >= 3) {
                        raccoon.unliked(userRating.user_id, userRating.book_id);
                    } else {
                        raccoon.undisliked(userRating.user_id, userRating.book_id);
                    }

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
                            
                            return savedRating;
                        })
                        .then( (savedRating) => {
                            // update raccoon preference
                            if (savedRating.rating >= 3) {
                                raccoon.liked(savedRating.user_id, savedRating.book_id);
                            } else {
                                raccoon.disliked(savedRating.user_id, savedRating.book_id);
                            }
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

    /**
     * GET /api/books/recommend
     * Expects: {
     *      header: bearer-token
     * }
     * Recommends user 5 books he/she may like
     * Returns the book ids
     * Responds: {
     *      200: { body: books }        // success
     *      401: {}                     // unauthorized for not logged in users
     *      500: {}                     // internal error
     * }
     */
    recommendForUser: (req, res, next) => {
        const targetUserID = req.user._id;

        // ask raccoon for recoms
        raccoon.recommendFor(targetUserID, 5)
            .then( (results) => {
                BC.getBookProfiles(results)
                    .then( (books) => {
                        res.status(200).json({
                            message: 'recommended books',
                            books: books
                        });
                    })
                    .catch( (err) => {
                        return next(err);
                    });
            })
            .catch( (err) => {
                return next(err);
            });
    }
    
};

module.exports = RatingController;