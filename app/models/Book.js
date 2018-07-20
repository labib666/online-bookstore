var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var BookSchema = new mongoose.Schema({  
    title: String,
    author: String,
    ISBN: String
});

BookSchema.plugin(timestamps);

mongoose.model('Book', BookSchema, 'books');
module.exports = mongoose.model('Book');