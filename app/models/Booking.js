var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var BookingSchema = new mongoose.Schema({  
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    quantity: Number,
    status: String
});

BookingSchema.plugin(timestamps);

module.exports = mongoose.model('Booking', BookingSchema, 'bookings');