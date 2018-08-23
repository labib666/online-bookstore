const createError = require('http-errors');
const raccoon = require('raccoon');
const axios = require('axios');

const Book = require('../models/Book');
const Category = require('../models/Category');

const RC = require('./RatingController');

/**
 * Fetches the book profile, including its categories
 * @param {string} book_ids // array of book ids to fetch
 */
const getBookProfiles = (book_ids) => {
    return new Promise((resolve,reject) => {
        let promises = [];
        book_ids.forEach( (entry) => {
            promises.push(
                fetchBookProfile(entry)
            );
        });
        Promise.all(promises)
            .then( (books) => {
                // respond with book profiles
                resolve(books);
            })
            .catch( (err) => {
                reject(err);
            });
    });
};

/**
 * Fetches the book profile, including its categories
 * @param {string} book_id 
 */
const fetchBookProfile = (book_id) => {
    return new Promise((resolve,reject) => {
        Book.findById(book_id, {
            createdAt: false,
            updatedAt: false
        })
            .then( (book) => {
                // book not in db
                if (!book) {
                    reject(createError(404,'book not found'));
                } else {
                    // book found. find the category it belongs to.
                    Category.distinct('category_name',{
                        book_id: book._id
                    })
                        .then( (categories) => {
                            book = book.toObject();
                            book.categories = categories;
                            // look for the rating of the book
                            RC.getAverageRating(book._id).then( (rating) => {
                                book.rating = rating;
                                resolve(book);
                            }).catch( (err) => {
                                reject(err);
                            });
                        })
                        .catch( (err) => {
                            reject(err);
                        });
                }
            })
            .catch( (err) => {
                reject(err);
            });
    });
};

/**
 * Get profile image for a given isbn
 * @param {string} isbn
 */
const getGoogleBookProfile = (isbn) => {
    return new Promise( (resolve,reject) => {
        const api_key = process.env.GOOGLE_BOOKS_API_KEY;
        const req_uri = 'https://www.googleapis.com/books/v1/volumes'
                        +'?q=isbn:'+isbn
                        +'&key='+api_key;
        axios.get(req_uri)
            .then( (response) => {
                const data = response.data;
                if (data.totalItems < 1) {
                    reject(createError(422,'\'ISBN\' must have a valid ISBN 10 value'));
                } else {
                    let bestItem = data.items[0];
                    if (!('volumeInfo' in bestItem)) {
                        bestItem.volumeInfo = {};
                    }
                    if (!('description' in bestItem.volumeInfo)) {
                        bestItem.volumeInfo.description = '';
                    }
                    bestItem = bestItem.volumeInfo;
                    data.items.forEach( (item) => {
                        if (!('volumeInfo' in item)) {
                            item.volumeInfo = {};
                        }
                        if (!('description' in item.volumeInfo)) {
                            item.volumeInfo.description = '';
                        }
                        if ( ('searchInfo' in item) && ('textSnippet' in item.searchInfo) && 
                            item.volumeInfo.description.length < item.searchInfo.textSnippet.length) {
                            item.volumeInfo.description = item.searchInfo.textSnippet;
                        }
                        if (item.volumeInfo.description.length 
                            > bestItem.description.length) {
                            bestItem = item.volumeInfo;
                        }
                    });
                    if (!('imageLinks' in bestItem)) {
                        bestItem.imageLinks = {};
                    }
                    if (!('thumbnail' in bestItem.imageLinks)) {
                        bestItem.imageLinks.thumbnail = 'https://api.adorable.io/avatars/285/'+isbn;
                    }
                    resolve(bestItem);
                }
            })
            .catch( (err) => {
                reject(err);
            });
    });
};

const BookController = {

    /**
     * GET /api/books/
     * Returns all book profiles
     * Expects: {
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: books }    // success
     *      401: {}                 // unauthorized for not logged in user
     *      500: {}                 // internal error
     * }
     */
    getAllBooks: (req, res, next) => {
        // look up books in db
        Book.distinct('_id')
            .then( (entries) => {
                getBookProfiles(entries)
                    .then( (books) => {
                        res.status(200).json({
                            message: 'books retrieved successfully',
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
    },

    /**
     * POST /api/books
     * Creates new book
     * Returns new book id
     * Expects: {
     *      body:   title, author, isbn
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: book } // success
     *      401: {}             // unauthorized for not logged in users
     *      403: {}             // forbidden for users with no moderator access
     *      409: {}             // conflict with existing data
     *      422: {}             // invalid data provided
     *      500: {}             // internal error
     * }
     */
    addBook: function (req, res, next) {
        // check if the user has previlige for this
        if (!req.user.isModerator) {
            return next(createError(403, 'user not authorized for this action'));
        }
        
        // Credentials are okay
        const title = req.body.title;
        const author = req.body.author;
        const ISBN = req.body.ISBN;
        let details = req.body.details;
        getGoogleBookProfile(ISBN)
            .then( (item) => {
                const image = item.imageLinks.thumbnail;
                if (details.length === 0) {
                    details = item.description;
                }
                Book.findOne({ ISBN: ISBN })
                    .then( (book) => {
                        // same book exists
                        if (book) {
                            return next(createError(409,'book already in collection'));
                        }
                        // duplicate does not exist. create new book
                        Book.create({
                            title: title,
                            author: author,
                            ISBN: ISBN,
                            details: details,
                            image: image
                        })
                            .then( (newBook) => {
                                // new book created
                                // send back the book id
                                res.status(200).json({
                                    message: 'book successfully added',
                                    book: newBook._id
                                });
                            })
                            .catch( (err) => {
                                return next(err);
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
     * GET /api/books/:id
     * Returns book profile for the given id
     * Expects: {
     *      params: book._id
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: book }             // success
     *      401: {}                         // unauthorized for not logged in user
     *      404: {}                         // book not found
     *      500: {}                         // internal error
     * }
     */
    getBook: (req, res, next) => {        
        // request is okay. look up the book
        fetchBookProfile(req.params.id)
            .then( (book) => {
                res.status(200).json({
                    message: 'successfully retrieved book',
                    book: book
                });
            })
            .catch( (err) => {
                return next(err);
            });
    },

    /**
     * PATCH /api/books/:id
     * Updates book data
     * Returns book id
     * Expects: {
     *      params: book._id
     *      body:   title (optional), author (optional)
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: user } // success
     *      401: {}             // unauthorized for not logged in user
     *      403: {}             // forbidden (no moderator access, changing isbn )
     *      404: {}             // book not found
     *      422: {}             // invalid data provided
     *      500: {}             // internal error
     * }
     */
    updateBook: (req, res, next) => {
        // validated book id
        const targetBookID = req.params.id;
        
        // look up the book in db
        Book.findById(targetBookID)
            .then( (targetBook) => {
                targetBook.title = req.body.title;
                targetBook.author = req.body.author;
                targetBook.details = req.body.details;
                getGoogleBookProfile(targetBook.ISBN)
                    .then( (item) => {
                        // save changed data in database
                        targetBook.image = item.imageLinks.thumbnail;
                        if (targetBook.details.length === 0) {
                            targetBook.details = item.description;
                        }
                        targetBook.save()
                            .then( (updatedBook) => {
                                res.status(200).json({
                                    message: 'book updated successfully',
                                    book: updatedBook._id
                                });
                            })
                            .catch( (err) => {
                                return next(err);
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
     * GET /api/books/search
     * Fetches all the books that match the search
     * Expects: {
     *      query:  search
     *      header: bearer-token
     * }
     * Responds: {
     *      200: { body: books }    // success
     *      401: {}                 // unauthorized for not logged in users
     *      500: {}                 // internal error
     * }
     */
    searchBook: (req,res,next) => {
        const search = req.query.search;

        if (search.length === 0) {
            // search field does not exist or is empty
            res.status(200).json({
                message: 'search results',
                books: []
            });
        } else {
            // look for the searched string
            Book.find({
                $text: {
                    $search: search
                }
            },{
                score: {
                    $meta: 'textScore'
                }
            }, {
                sort: {
                    score: {
                        $meta: 'textScore'
                    }
                }
            })
                .then( (entries) => {
                    let promises = [];
                    entries.forEach( (entry) => {
                        promises.push(
                            fetchBookProfile(entry._id)
                        );
                    });
                    Promise.all(promises)
                        .then( (books) => {
                        // respond with book profiles
                            res.status(200).json({
                                message: 'books retrieved successfully',
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
        raccoon.recommendFor(targetUserID, 3)
            .then( (results) => {
                getBookProfiles(results)
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
    },

    getBookProfiles
};

module.exports = BookController;
