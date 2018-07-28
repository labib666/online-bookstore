var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var CategorySchema = new mongoose.Schema({  
    category_name: String,
    book_id: String
});

CategorySchema.plugin(timestamps);

mongoose.model('Category', CategorySchema, 'categories');
module.exports = mongoose.model('Category');