var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var RatingSchema = new mongoose.Schema({  
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    rating: Number,
    review: String
});

RatingSchema.index({ user_id: 1, book_id: 1 }, { unique: true });
RatingSchema.plugin(timestamps);

module.exports = mongoose.model('Rating', RatingSchema, 'ratings');