var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var BookSchema = new mongoose.Schema({  
    title: String,
    author: String,
    ISBN: String
});

BookSchema.index({
    title: 'text',
    author: 'text',
    ISBN: 'text'
});

BookSchema.plugin(timestamps);

mongoose.model('Book', BookSchema, 'books');
module.exports = mongoose.model('Book');