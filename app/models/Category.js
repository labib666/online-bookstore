var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var CategorySchema = new mongoose.Schema({  
    category_name: String,
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }
});

CategorySchema.index({ category_name: 1, book_id: 1 }, { unique: true });
CategorySchema.plugin(timestamps);

module.exports = mongoose.model('Category', CategorySchema, 'categories');
