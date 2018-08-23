var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var BookSchema = new mongoose.Schema({  
    title: String,
    author: String,
    ISBN: {
        type: String,
        unique: true,
        dropDups: true
    },
    details: String
});

BookSchema.index({
    title: 'text',
    author: 'text',
    ISBN: 'text'
});

BookSchema.plugin(timestamps);

module.exports = mongoose.model('Book', BookSchema, 'books');