var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var RatingSchema = new mongoose.Schema({  
    user_id: String,
    book_id: String,
    rating: Number,
    review: String
});

RatingSchema.plugin(timestamps);

mongoose.model('Rating', RatingSchema, 'ratings');
module.exports = mongoose.model('Rating');